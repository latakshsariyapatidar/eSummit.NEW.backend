const mongoose = require("mongoose");

const Order = require("./orders.model");
const { Pass, PASS_STATUS } = require("../passes/pass.model");

const qrService = require("../qrService/qr.service");

const crypto = require("crypto");
const { ORDER_STATUS, ORDER_EXPIRY_MINUTES } = require("./orders.constants");

/**
 * ---------------------------------------------------------------------
 * Private Helper Functions
 * ---------------------------------------------------------------------
 */

/**
 * Throws an operational error.
 */
const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
};

const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  throw error;
};

/**
 * Calculates the total order amount from pass requests.
 */
const calculateCartValue = (passes) => {
  return passes.reduce((sum, pass) => sum + pass.passPrice, 0);
};

/**
 * Returns expiry date.
 */
const getExpiryDate = () => {
  return new Date(Date.now() + ORDER_EXPIRY_MINUTES * 60 * 1000);
};

/**
 * Checks whether order has expired.
 */
const isOrderExpired = (order) => {
  return order.expiresAt < new Date();
};

/**
 * Appends history event.
 */
const appendHistory = (order, status, by = null) => {
  order.history.push({
    status,
    at: new Date(),
    by,
  });
};

/**
 * Creates the immutable purchase snapshot.
 */
const buildPassSnapshot = (passes) => {
  return passes.map((pass) => ({
    passType: pass.passType,
    passPrice: pass.passPrice,
    attendeeName: pass.attendeeName,
    attendeeEmail: pass.attendeeEmail,
    attendeeGender: pass.attendeeGender,
    collegeName: pass.collegeName,
  }));
};

/**
 * ---------------------------------------------------------------------
 * Create Order
 * ---------------------------------------------------------------------
 */

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase(); // Compact timestamp
  const random = crypto
    .randomBytes(4)
    .toString("base64")
    .replace(/[^A-Z0-9]/gi, "")
    .substring(0, 6)
    .toUpperCase();

  return `ORD-${timestamp}-${random}`;
};

const generatePassId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = crypto
    .randomBytes(4)
    .toString("base64")
    .replace(/[^A-Z0-9]/gi, "")
    .substring(0, 6)
    .toUpperCase();

  return `PAS-${timestamp}-${random}`;
};

const createOrder = async ({ cartValue, passes }) => {
  const calculatedAmount = calculateCartValue(passes);

  if (calculatedAmount !== cartValue) {
    badRequest("Cart value mismatch.");
  }

  const orderId = await generateOrderId();

  const order = await Order.create({
    orderId,

    amount: calculatedAmount,

    status: ORDER_STATUS.PENDING,

    expiresAt: getExpiryDate(),

    passRequests: buildPassSnapshot(passes),

    history: [
      {
        status: ORDER_STATUS.PENDING,
        at: new Date(),
      },
    ],
  });

  /**
   * Generate Payment QR
   */
  const { qrBase64 } = await qrService.generatePaymentQr({
    cartPrice: calculatedAmount,
    orderId,
  });

  return {
    orderId,
    qrBase64,
  };
};

/**
 * ---------------------------------------------------------------------
 * Submit UTR
 * ---------------------------------------------------------------------
 */

const submitUTR = async ({ orderId, utr, paymentScreenshot }) => {
  const order = await Order.findOne({
    orderId,
  });

  if (!order) {
    notFound("Order not found.");
  }

  /**
   * Expired orders cannot receive payments.
   */
  if (isOrderExpired(order)) {
    if (order.status !== ORDER_STATUS.CANCELLED) {
      order.status = ORDER_STATUS.CANCELLED;

      appendHistory(order, ORDER_STATUS.CANCELLED);

      await order.save();
    }

    badRequest("Order has expired.");
  }

  /**
   * Only pending orders can submit UTR.
   */
  if (order.status !== ORDER_STATUS.PENDING) {
    switch (order.status) {
      case ORDER_STATUS.PAYMENT_SUBMITTED:
        badRequest("Payment has already been submitted.");

      case ORDER_STATUS.VERIFIED:
        badRequest("Order has already been verified.");

      case ORDER_STATUS.REJECTED:
        badRequest("Order has already been rejected.");

      case ORDER_STATUS.CANCELLED:
        badRequest("Order has been cancelled.");

      default:
        badRequest("Order is not eligible for payment.");
    }
  }

  /**
   * Prevent duplicate UTRs.
   */
  const existingUTR = await Order.exists({
    paymentUTR: utr,
  });

  if (existingUTR) {
    badRequest("This UTR has already been used.");
  }

  order.paymentUTR = utr;

  /**
   * Screenshot is optional.
   */
  if (paymentScreenshot) {
    order.paymentScreenshot = paymentScreenshot;
  }

  order.status = ORDER_STATUS.PAYMENT_SUBMITTED;

  appendHistory(order, ORDER_STATUS.PAYMENT_SUBMITTED);

  await order.save();

  return {
    orderId: order.orderId,
    status: order.status,
  };
};
/**
 * ---------------------------------------------------------------------
 * Fetch all orders awaiting verification.
 * ---------------------------------------------------------------------
 */

const getPendingOrders = async () => {
  return Order.find({
    status: ORDER_STATUS.PAYMENT_SUBMITTED,
  }).sort({
    createdAt: 1,
  });
};

/**
 * ---------------------------------------------------------------------
 * Fetch complete order details.
 * ---------------------------------------------------------------------
 */

const getOrderDetails = async (orderId) => {
  const order = await Order.findOne({
    orderId,
  }).populate("passes");

  if (!order) {
    notFound("Order not found.");
  }

  return order;
};

/**
 * ---------------------------------------------------------------------
 * Approve Order
 * ---------------------------------------------------------------------
 *
 * Transaction Flow:
 *
 * Start Transaction
 *      ↓
 * Fetch Order
 *      ↓
 * Validate Status
 *      ↓
 * Generate Pass IDs
 *      ↓
 * Generate Pass QRs
 *      ↓
 * Create Pass Documents
 *      ↓
 * Update Order.passes
 *      ↓
 * Update Audit Fields
 *      ↓
 * Commit
 *
 * If anything fails → Rollback
 */

const approveOrder = async ({ orderId, adminId }) => {
  const session = await mongoose.startSession();

  try {
    let createdPasses = [];

    await session.withTransaction(async () => {
      const order = await Order.findOne({ orderId }).session(session);

      if (!order) {
        notFound("Order not found.");
      }

      /**
       * Validate current order status.
       */
      if (order.status !== ORDER_STATUS.PAYMENT_SUBMITTED) {
        switch (order.status) {
          case ORDER_STATUS.VERIFIED:
            badRequest("Order has already been verified.");

          case ORDER_STATUS.REJECTED:
            badRequest("Order has already been rejected.");

          case ORDER_STATUS.PENDING:
            badRequest("Payment has not been submitted yet.");

          case ORDER_STATUS.CANCELLED:
            badRequest("Order has been cancelled.");

          default:
            badRequest("Order cannot be approved.");
        }
      }

      /**
       * Safety check.
       */
      if (order.passes.length > 0) {
        badRequest("Passes have already been generated.");
      }

      /**
       * Build pass documents.
       */
      const passDocuments = [];

      for (const attendee of order.passRequests) {
        const passId = await generatePassId();

        const { qrBase64 } = await qrService.generatePassQr({
          passId,
          orderId: order.orderId,
        });

        passDocuments.push({
          passId,
          
          // Human-readable Order ID
          orderId: order.orderId,

          // MongoDB reference
          order: order._id,

          type: attendee.passType,
          price: attendee.passPrice,

          attendeeName: attendee.attendeeName,
          attendeeEmail: attendee.attendeeEmail,
          attendeeGender: attendee.attendeeGender,
          collegeName: attendee.collegeName,

          qr: qrBase64,

          status: PASS_STATUS.ACTIVE,

          checkedIn: false,
        });
      }

      /**
       * Insert all passes.
       */
      createdPasses = await Pass.insertMany(passDocuments, {
        session,
      });

      /**
       * Store generated pass references.
       */
      order.passes = createdPasses.map((pass) => pass._id);

      /**
       * Audit
       */
      order.status = ORDER_STATUS.VERIFIED;
      order.verifiedBy = adminId;
      order.verifiedAt = new Date();

      appendHistory(order, ORDER_STATUS.VERIFIED, adminId);

      await order.save({ session });
    });

    return {
      orderId,
      status: ORDER_STATUS.VERIFIED,
      passes: createdPasses.map((pass) => ({
        passId: pass.passId,
        attendeeName: pass.attendeeName,
        attendeeEmail: pass.attendeeEmail,
        qr: pass.qr,
      })),
    };
  } finally {
    await session.endSession();
  }
};

/**
 * ---------------------------------------------------------------------
 * Reject Order
 * ---------------------------------------------------------------------
 */

const rejectOrder = async ({ orderId, adminId, reason }) => {
  const order = await Order.findOne({
    orderId,
  });

  if (!order) {
    notFound("Order not found.");
  }

  if (order.status !== ORDER_STATUS.PAYMENT_SUBMITTED) {
    badRequest("Only submitted payments can be rejected.");
  }

  order.status = ORDER_STATUS.REJECTED;

  order.rejectedBy = adminId;

  order.rejectedReason = reason;

  order.rejectedAt = new Date();

  appendHistory(order, ORDER_STATUS.REJECTED, adminId);

  await order.save();

  return {
    orderId,

    status: order.status,
  };
};

/**
 * ---------------------------------------------------------------------
 * Exports
 * ---------------------------------------------------------------------
 */

module.exports = {
  createOrder,

  submitUTR,

  getPendingOrders,

  getOrderDetails,

  approveOrder,

  rejectOrder,
};
