const express = require("express");

const passController = require("./pass.controller");
const authMiddleware = require("../auth/auth.middleware");

// Replace these with your actual middleware
// const { authenticate, authorizeAdmin } = require('../../common/middleware/auth');

const router = express.Router();

/**
 * ---------------------------------------------------------------------
 * Public Routes
 * ---------------------------------------------------------------------
 */

/**
 * Get pass details.
 *
 * GET /passes/:passId
 */
router.get("/:passId", passController.getPassById);

/**
 * Get all passes belonging to an order.
 *
 * GET /passes/order/:orderId
 */
router.get("/order/:orderId", passController.getPassesByOrder);

/**
 * ---------------------------------------------------------------------
 * Admin Routes
 * ---------------------------------------------------------------------
 */

/**
 * Check in a pass.
 *
 * POST /passes/:passId/check-in
 */
router.post(
  "/:passId/check-in",

  authMiddleware.protect,
  authMiddleware.requireVolunteer,
  // authenticate,
  // authorizeAdmin,
  passController.checkInPass,
);

/**
 * Cancel a pass.
 *
 * POST /passes/:passId/cancel
 */
router.post(
  "/:passId/cancel",
  authMiddleware.protect,
  authMiddleware.requireVolunteer,
  // authenticate,
  // authorizeAdmin,
  passController.cancelPass,
);

module.exports = router;
