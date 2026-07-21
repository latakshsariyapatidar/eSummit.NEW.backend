const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const env = require('../../common/config/env');
const apiResponse = require('../../common/utils/apiResponse');
const logger = require('../../common/lib/logger');


/**
 * protect middleware
 * Extracts JWT token, decodes it, and attaches the user key payload to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return apiResponse.error(res, 'Not authorized to access this route. Token is missing.', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // If it's the pre-shared Admin Key session (id = 0)
    if (decoded.role === 'admin' && decoded.id === 0) {
      req.user = {
        ID: 0,
        role: 'admin',
      };
      return next();
    }

    // Find the volunteer/admin key record in the database
    const user = await User.findOne({ ID: decoded.id });
    if (!user) {
      return apiResponse.error(res, 'Not authorized. The key associated with this session no longer exists.', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return apiResponse.error(res, 'Not authorized to access this route. Token is invalid or expired.', 401);
  }
};

/**
 * requireAdmin middleware
 * Restricts access to admin roles only.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return apiResponse.error(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
};

/**
 * requireVolunteer middleware
 * Restricts access to volunteer or admin roles.
 */
const requireVolunteer = (req, res, next) => {
  if (!req.user || (req.user.role !== 'volunteer' && req.user.role !== 'admin')) {
    return apiResponse.error(res, 'Access denied. Volunteer privileges required.', 403);
  }
  next();
};

module.exports = {
  protect,
  requireAdmin,
  requireVolunteer,
};

