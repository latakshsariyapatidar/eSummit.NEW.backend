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
const authRouter = express.Router();
const adminRouter = express.Router();
const authController = require('./auth.controller');
const { verifyAdminKey, protect } = require('./auth.middleware');
const { authLimiter } = require('../../common/middleware/rateLimiter');

// --- Auth Router Endpoints (/api/auth) ---
// Key verification/login protected by rate limiter
authRouter.post('/verify-key', authLimiter, authController.verifyKey);
authRouter.post('/logout', authController.logoutHandler);
authRouter.get('/me', protect, authController.getMeHandler);

// --- Admin Router Endpoints (/api/admin) ---
// All administrative endpoints require valid X-Admin-Key
adminRouter.post('/keys', verifyAdminKey, authController.createKeyHandler);
adminRouter.get('/keys', verifyAdminKey, authController.listKeysHandler);
adminRouter.delete('/keys/:id', verifyAdminKey, authController.deleteKeyHandler);
adminRouter.get('/db-state', verifyAdminKey, authController.getDbState);
adminRouter.post('/order/verify', verifyAdminKey, authController.verifyOrder);
adminRouter.get('/passes', verifyAdminKey, authController.getPasses);
adminRouter.post('/passes/update', verifyAdminKey, authController.updatePasses);

module.exports = {
  authRouter,
  adminRouter,
};

