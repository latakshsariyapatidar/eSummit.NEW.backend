/**
 * Rate Limiter Middleware - E-Summit '26
 * 
 * Standard limits protecting endpoints from Brute Force and DDoS queries.
 * Employs 'express-rate-limit'.
 * 
 * Core setup:
 * - standardLimiter: For public content APIs (e.g. 100 requests per 15 minutes).
 * - authLimiter: Strict limits for login / password resets (e.g. 5 requests per 15 minutes).
 * - paymentLimiter: Limits order generation and checking queries (e.g. 15 requests per 15 minutes).
 */

const rateLimit = require('express-rate-limit');
const apiResponse = require('../utils/apiResponse');

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return apiResponse.error(res, 'Too many requests, please try again later.', 429);
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Limit login / key verify to 10 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return apiResponse.error(res, 'Too many authentication attempts, please try again later.', 429);
  }
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit order submits / checks
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return apiResponse.error(res, 'Too many order operations, please try again later.', 429);
  }
});

module.exports = {
  standardLimiter,
  authLimiter,
  paymentLimiter
};
