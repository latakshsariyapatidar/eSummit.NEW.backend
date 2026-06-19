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
const { requireAdmin, requireVolunteer } = require('./auth.middleware');

// TODO: 1. Setup public endpoints (login, forgot-password, reset-password)
// TODO: 2. Setup protected volunteer & admin profile endpoints (me, logout)
// TODO: 3. Setup administrator-only endpoints (register-volunteer, management)

module.exports = router;
