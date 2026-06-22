/**
 * Orders Routes - E-Summit '26
 * 
 * Defines routing endpoints for checking out tickets, managing attendees, and retrieving order details.
 * 
 * Endpoints to be defined:
 * - POST /api/orders/checkout         -> Create temporary order, reserve ticket, return payment info (UPI QR metadata).
 * - POST /api/orders/:id/payment      -> Submit transaction ID/UTR receipt screenshot to verify order.
 * - GET  /api/orders/:id/status       -> Check order status (pending, verified, rejected).
 * - GET  /api/orders/                 -> Admin list all orders (filtered by status, payment method, etc.).
 * - PATCH /api/orders/:id/verify      -> Admin manually confirm receipt of money, triggers ticket generation.
 * - PATCH /api/orders/:id/reject      -> Admin reject order due to bad screenshot or unpaid transaction.
 */

const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
// TODO: Setup public booking routes:
// - POST /submit -> submitOrder handler
// - GET /status -> getOrderStatus handler

router.post('/submit', ordersController.submitOrder);
router.get('/status', ordersController.getOrderStatus);

module.exports = router;
