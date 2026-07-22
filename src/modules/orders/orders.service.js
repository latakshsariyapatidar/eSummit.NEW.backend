const mongoose = require('mongoose');

const Order = require('./orders.model');
const { Pass, PASS_STATUS } = require('../passes/pass.model');

const qrService = require('../qrService/qr.service');

const crypto = require('crypto');
const { ORDER_STATUS, ORDER_EXPIRY_MINUTES } = require('./orders.constants');

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
    eventName: pass.eventName,
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
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 6)
    .toUpperCase();

  return `ORD-${timestamp}-${random}`;
};

const generatePassId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = crypto
    .randomBytes(4)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 6)
    .toUpperCase();

  return `PAS-${timestamp}-${random}`;
};

const createOrder = async ({ cartValue, passes }) => {
  const calculatedAmount = calculateCartValue(passes);

  if (calculatedAmount !== cartValue) {
    badRequest('Cart value mismatch.');
  }

  const orderId = await generateOrderId();

  /**
   * Generate Payment QR and retain the VPA encoded in it.
   */
  const { qrBase64, vpa } = await qrService.generatePaymentQr({
    cartPrice: calculatedAmount,
    orderId,
  });

  const order = await Order.create({
    orderId,

    amount: calculatedAmount,

    paymentUPI: vpa,

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

  return {
    orderId,
    qrBase64,
    paymentUPI: order.paymentUPI,
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
    notFound('Order not found.');
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

    badRequest('Order has expired.');
  }

  /**
   * Only pending orders can submit UTR.
   */
  if (order.status !== ORDER_STATUS.PENDING) {
    switch (order.status) {
      case ORDER_STATUS.PAYMENT_SUBMITTED:
        badRequest('Payment has already been submitted.');

      case ORDER_STATUS.VERIFIED:
        badRequest('Order has already been verified.');

      case ORDER_STATUS.REJECTED:
        badRequest('Order has already been rejected.');

      case ORDER_STATUS.CANCELLED:
        badRequest('Order has been cancelled.');

      default:
        badRequest('Order is not eligible for payment.');
    }
  }

  /**
   * Prevent duplicate UTRs.
   */
  const existingUTR = await Order.exists({
    paymentUTR: utr,
  });

  if (existingUTR) {
    badRequest('This UTR has already been used.');
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
  }).populate('passes');

  if (!order) {
    notFound('Order not found.');
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
  const performApproval = async (session = null) => {
    const query = Order.findOne({ orderId });
    if (session) {
      query.session(session);
    }
    const order = await query;

    if (!order) {
      notFound('Order not found.');
    }

    if (order.status !== ORDER_STATUS.PAYMENT_SUBMITTED) {
      switch (order.status) {
        case ORDER_STATUS.VERIFIED:
          badRequest('Order has already been verified.');

        case ORDER_STATUS.REJECTED:
          badRequest('Order has already been rejected.');

        case ORDER_STATUS.PENDING:
          badRequest('Payment has not been submitted yet.');

        case ORDER_STATUS.CANCELLED:
          badRequest('Order has been cancelled.');

        default:
          badRequest('Order cannot be approved.');
      }
    }

    if (order.passes.length > 0) {
      badRequest('Passes have already been generated.');
    }

    const passDocuments = [];

    for (const attendee of order.passRequests) {
      const passId = await generatePassId();

      const { qrBase64 } = await qrService.generatePassQr({
        passId,
        orderId: order.orderId,
      });

      passDocuments.push({
        passId,
        orderId: order.orderId,
        order: order._id,
        type: attendee.passType,
        price: attendee.passPrice,
        eventName: attendee.eventName,
        attendeeName: attendee.attendeeName,
        attendeeEmail: attendee.attendeeEmail,
        attendeeGender: attendee.attendeeGender,
        collegeName: attendee.collegeName,
        qr: qrBase64,
        status: PASS_STATUS.ACTIVE,
        checkedIn: false,
      });
    }

    const insertOptions = session ? { session } : {};
    const createdPasses = await Pass.insertMany(passDocuments, insertOptions);

    order.passes = createdPasses.map((pass) => pass._id);
    order.status = ORDER_STATUS.VERIFIED;
    order.verifiedBy = adminId;
    order.verifiedAt = new Date();

    appendHistory(order, ORDER_STATUS.VERIFIED, adminId);

    const saveOptions = session ? { session } : {};
    await order.save(saveOptions);

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
  };

  let session;
  try {
    session = await mongoose.startSession();
    let result;
    try {
      await session.withTransaction(async () => {
        result = await performApproval(session);
      });
    } catch (err) {
      if (err.message && err.message.includes('Transaction numbers are only allowed')) {
        result = await performApproval(null);
      } else {
        throw err;
      }
    }
    return result;
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }
    return await performApproval(null);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

/**
 * ---------------------------------------------------------------------
 * Reject Order
 * ---------------------------------------------------------------------
 */

const rejectOrder = async ({ orderId, adminId, reason }) => {
  const order = await Order.findOne({ orderId });

  if (!order) {
    notFound('Order not found.');
  }

  if (order.status !== ORDER_STATUS.PAYMENT_SUBMITTED) {
    badRequest('Only submitted payments can be rejected.');
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
    rejectedReason: order.rejectedReason,

    notifications: order.passRequests.map((attendee) => ({
      email: attendee.attendeeEmail,
      buyerName: attendee.attendeeName,
      rejectionReason: reason,
    })),
  };
};

/**
 * ---------------------------------------------------------------------
 * Fetch all verified orders.
 * ---------------------------------------------------------------------
 */

const getVerifiedOrders = async () => {
  return Order.find({
    status: ORDER_STATUS.VERIFIED,
  })
    .populate('passes')
    .sort({
      verifiedAt: -1,
      createdAt: -1,
    });
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

  getVerifiedOrders,

  getOrderDetails,

  approveOrder,

  rejectOrder,
};

