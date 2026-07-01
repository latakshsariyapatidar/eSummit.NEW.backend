/**
 * Auth Controller - E-Summit '26
 * 
 * Maps HTTP request structures (headers, cookies, query, body) to internal Auth Service methods.
 * Formats response payloads and sends JSON/Cookie outcomes back to client.
 * 
 * Logic to be implemented:
 * - registerAdminHandler()     -> Extract fields, call service, return admin profile.
 * - registerVolunteerHandler() -> Extract fields, verify action initiator is admin, create volunteer, send credentials.
 * - loginHandler()             -> Validate credentials, call auth service to sign JWT, set cookie or return token.
 * - logoutHandler()            -> Clear cookie, invalidate token, return success message.
 * - getMeHandler()             -> Read request.user (set by auth middleware) and return user details.
 * - forgotPasswordHandler()    -> Initiate mail dispatch via email provider for reset request.
 * - resetPasswordHandler()     -> Verify temporary token and update password in DB.
 */

const authService = require('./auth.service');
const apiResponse = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');
const env = require('../../common/config/env');
const User = require('./auth.model');


const verifyKey = asyncHandler(async (req, res) => {
  const key = req.body.key || req.body.admin_key;
  if (!key) {
    return apiResponse.error(res, 'Access key is required', 400);
  }

  const { token, role } = await authService.authenticateKey(key);

  // Set HTTP-Only cookie named 'token' valid for 1 day
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return apiResponse.success(res, { token, role }, 'Key verified successfully');
});

const logoutHandler = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  return apiResponse.success(res, null, 'Logged out successfully');
});

const getMeHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    return apiResponse.error(res, 'No active session found', 401);
  }
  return apiResponse.success(res, {
    ID: req.user.ID,
    role: req.user.role,
  });
});

const createKeyHandler = asyncHandler(async (req, res) => {
  const newKey = await authService.generateVolunteerKey();
  return apiResponse.success(res, newKey, 'Volunteer key generated successfully', 201);
});

const listKeysHandler = asyncHandler(async (req, res) => {
  const keys = await authService.listKeys();
  return apiResponse.success(res, keys, 'Volunteer keys retrieved successfully');
});

const deleteKeyHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await authService.deleteKey(id);
  return apiResponse.success(res, null, 'Key revoked successfully');
});


module.exports = {
  verifyKey,
  logoutHandler,
  getMeHandler,
  createKeyHandler,
  listKeysHandler,
  deleteKeyHandler,
};

