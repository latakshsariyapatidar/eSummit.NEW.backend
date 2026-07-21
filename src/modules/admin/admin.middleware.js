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



module.exports = {
  verifyAdminKey,
};