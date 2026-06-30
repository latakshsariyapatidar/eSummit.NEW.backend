/**
 * Auth Middleware - E-Summit '26
 * 
 * Intercepts HTTP requests to enforce authentication checks and role constraints.
 * 
 * Middlewares to implement:
 * - protect:
 *   - Extract JWT token from 'Authorization' header Bearer token or cookie.
 *   - Decode token, verify validity, find associated user in DB.
 *   - Inject verified user details onto the `req.user` namespace.
 * - requireAdmin:
 *   - Enforce that `req.user` is loaded and user.role === 'admin'.
 *   - Rejects request with a 403 Forbidden if not.
 * - requireVolunteer:
 *   - Enforce that `req.user` is loaded and role matches either 'volunteer' or 'admin'.
 *   - Allows flexible access for volunteers to scan codes but restricts high-level settings.
 */

const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const env = require('../../common/config/env');
const apiResponse = require('../../common/utils/apiResponse');
const logger = require('../../common/lib/logger');

/**
 * verifyAdminKey middleware
 * Validates the X-Admin-Key header on administrative requests.
 */
const verifyAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey) {
    return apiResponse.error(res, 'Admin key is missing from X-Admin-Key header', 401);
  }
  if (adminKey !== env.ADMIN_KEY) {
    return apiResponse.error(res, 'Invalid Admin Key', 403);
  }
  logger.info(`[Admin Audit] Admin action: ${req.method} ${req.originalUrl} from IP: ${req.ip}`);
  next();
};

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
  verifyAdminKey,
  protect,
  requireAdmin,
  requireVolunteer,
};

