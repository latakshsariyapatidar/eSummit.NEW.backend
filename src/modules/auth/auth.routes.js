/**
 * Auth Routes - E-Summit '26
 * 
 * Defines routing endpoints for authentication, session verification, and administrator/volunteer registration.
 * 
 * Endpoints to be defined:
 * - POST /api/auth/register-admin     -> Create root admin (restricted, development-only or passcode-secured)
 * - POST /api/auth/register-volunteer -> Admin creates a new volunteer account
 * - POST /api/auth/login              -> Authenticate admin/volunteer and issue JWT/HTTP-only cookies
 * - POST /api/auth/logout             -> Terminate session, clear cookies
 * - GET  /api/auth/me                 -> Retrieve current active user profile information
 * - POST /api/auth/forgot-password    -> Send password reset link/OTP
 * - POST /api/auth/reset-password     -> Reset password using OTP/token
 */

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyAdminKey } = require('./auth.middleware');

// TODO: 1. Setup public endpoints:
// - POST /verify-key -> verifyKey handler (Admin login)
router.post('/verify-key', authController.verifyKey);

// TODO: 2. Setup protected administrative endpoints (using verifyAdminKey middleware):
// - GET /db-state -> getDbState handler
// - POST /order/verify -> verifyOrder handler
// - GET /payment-screenshot/:filename -> getPaymentScreenshot handler
// - GET /passes -> getPasses handler
// - POST /passes/update -> updatePasses handler

router.get('/db-state', verifyAdminKey, authController.getDbState);
router.post('/order/verify', verifyAdminKey, authController.verifyOrder);
router.get('/payment-screenshot/:filename', verifyAdminKey, authController.getPaymentScreenshot);
router.get('/passes', verifyAdminKey, authController.getPasses);
router.post('/passes/update', verifyAdminKey, authController.updatePasses);

module.exports = router;
