const authService = require('./auth.service');
const apiResponse = require('../../common/utils/apiResponse');
const asyncHandler = require('../../common/utils/asyncHandler');
const env = require('../../common/config/env');


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


module.exports = {
  verifyKey,
  logoutHandler,
  getMeHandler,

};

