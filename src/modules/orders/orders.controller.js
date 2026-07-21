const asyncHandler = require("../../common/utils/asyncHandler");
const apiResponse = require("../../common/utils/apiResponse");
const Notification = require("../notifications/notification.model");
const orderService = require("./orders.service");

const {
  submitOrderSchema,
  submitUTRSchema,
  approveOrderSchema,
  rejectOrderSchema,
} = require("./orders.validation");

/**
 * ---------------------------------------------------------------------
 * Create Order
 * POST /orders/submit
 * ---------------------------------------------------------------------
 */
const createOrder = asyncHandler(async (req, res) => {
  const payload = submitOrderSchema.parse(req.body);

  const result = await orderService.createOrder(payload);

  return apiResponse.success(res, result, "Order created successfully.", 201);
});

/**
 * ---------------------------------------------------------------------
 * Submit UTR
 * POST /orders/utr
 * ---------------------------------------------------------------------
 */
const submitUTR = asyncHandler(async (req, res) => {
  const payload = submitUTRSchema.parse(req.body);

  const result = await orderService.submitUTR(payload);

  return apiResponse.success(res, result, "Payment submitted successfully.");
});

/**
 * ---------------------------------------------------------------------
 * Get Pending Orders
 * GET /orders/admin/pending
 * ---------------------------------------------------------------------
 */
const getPendingOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getPendingOrders();

  return apiResponse.success(
    res,
    orders,
    "Pending orders fetched successfully.",
  );
});

/**
 * ---------------------------------------------------------------------
 * Get Order Details
 * GET /orders/admin/:orderId
 * ---------------------------------------------------------------------
 */
const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.getOrderDetails(orderId);

  return apiResponse.success(res, order, "Order fetched successfully.");
});

/**
 * ---------------------------------------------------------------------
 * Approve Order
 * POST /orders/admin/:orderId/approve
 * ---------------------------------------------------------------------
 */
const approveOrder = asyncHandler(async (req, res) => {
  approveOrderSchema.parse({
    orderId: req.params.orderId,
  });

  const result = await orderService.approveOrder({
    orderId: req.params.orderId,
    adminId: req.user.id,
  });

  console.log("======== Got The results, inserting into the notifications queue =============");

  await Notification.insertMany(
    result.passes.map((pass) => ({
      type: "PASS_VERIFIED",
      payload: {
        email: pass.attendeeEmail,
        attendeeName: pass.attendeeName,
        passId: pass.passId,
        orderId: result.orderId,
        qrBase64: pass.qr,
      },
    })),
  );

  return apiResponse.success(res, result, "Order approved successfully.");
});

/**
 * ---------------------------------------------------------------------
 * Reject Order
 * POST /orders/admin/:orderId/reject
 * ---------------------------------------------------------------------
 */
const rejectOrder = asyncHandler(async (req, res) => {
  const payload = rejectOrderSchema.parse({
    orderId: req.params.orderId,
    reason: req.body.reason,
  });

  const result = await orderService.rejectOrder({
    ...payload,
    adminId: req.user.id,
  });

  await Notification.insertMany(
    result.notifications.map((notification) => ({
      type: "ORDER_REJECTED",
      payload: notification,
    })),
  );

  return apiResponse.success(res, result, "Order rejected successfully.");
});

module.exports = {
  createOrder,
  submitUTR,
  getPendingOrders,
  getOrderDetails,
  approveOrder,
  rejectOrder,
};
