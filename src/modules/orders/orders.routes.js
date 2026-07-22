const express = require('express');

const orderController = require('./orders.controller');

// Replace with your authentication middleware
// const { authenticate, authorizeAdmin } = require('../../common/middleware/auth');

const router = express.Router();
const adminMiddleware = require('../admin/admin.middleware');
const authMiddleware = require('../auth/auth.middleware');

/**
 * ---------------------------------------------------------------------
 * Public Routes
 * ---------------------------------------------------------------------
 */

/**
 * Create a new order.
 *
 * POST /orders/submit
 */
router.post('/submit', orderController.createOrder);

/**
 * Submit payment UTR.
 *
 * POST /orders/utr
 */
router.post('/utr', orderController.submitUTR);

/**
 * ---------------------------------------------------------------------
 * Admin Routes
 * ---------------------------------------------------------------------
 */

/**
 * Get all payment submitted orders.
 *
 * GET /orders/admin/pending
 */
router.get(
  '/admin/pending',
  authMiddleware.protect,
  adminMiddleware.verifyAdminKey,
  orderController.getPendingOrders,
);

/**
 * Get all verified orders.
 *
 * GET /orders/admin/verified
 */
router.get(
  '/admin/verified',
  authMiddleware.protect,
  adminMiddleware.verifyAdminKey,
  orderController.getVerifiedOrders,
);

/**
 * Get complete order details.
 *
 * GET /orders/admin/:orderId
 */
router.get(
  '/admin/:orderId',
  authMiddleware.protect,
  adminMiddleware.verifyAdminKey,
  orderController.getOrderDetails,
);

/**
 * Approve an order.
 *
 * POST /orders/admin/:orderId/approve
 */
router.post(
  '/admin/:orderId/approve',
  authMiddleware.protect,
  adminMiddleware.verifyAdminKey,
  orderController.approveOrder,
);

/**
 * Reject an order.
 *
 * POST /orders/admin/:orderId/reject
 */
router.post(
  '/admin/:orderId/reject',
  authMiddleware.protect,
  adminMiddleware.verifyAdminKey,
  orderController.rejectOrder,
);

module.exports = router;
