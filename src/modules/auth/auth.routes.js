const express = require('express');
const authRouter = express.Router();
const authController = require('./auth.controller');
const { protect } = require('./auth.middleware');
const { authLimiter } = require('../../common/middleware/rateLimiter');

// --- Auth Router Endpoints (/api/auth) ---
authRouter.post('/verify-key', authLimiter, authController.verifyKey);
authRouter.post('/logout', authController.logoutHandler);
authRouter.get('/me', protect, authController.getMeHandler);


module.exports = authRouter;
