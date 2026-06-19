/**
 * Payments Routes - E-Summit '26
 * 
 * Routing endpoints for payment-related operations, UPI QR processing, and administrative tracking.
 * 
 * Endpoints to be defined:
 * - GET  /api/payments/:orderId/qr   -> Generate dynamic UPI QR image for a specific order.
 * - POST /api/payments/:orderId/pay  -> Submit payment details (UTR number and receipt attachment) to mark order as pending verification.
 * - GET  /api/payments/verify/:utr   -> Check if a UTR number is already registered.
 */

const express = require('express');
const router = express.Router();
const paymentsController = require('./payments.controller');

// TODO: 1. Set up route to fetch payment QR code
// TODO: 2. Set up route to submit transaction reference (UTR)
// TODO: 3. Set up check-route for UTR double-spend checks

module.exports = router;
