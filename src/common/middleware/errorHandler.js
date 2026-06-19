/**
 * Global Error Handler - E-Summit '26
 * 
 * Centralized middleware to intercept errors thrown anywhere inside Express routers or controllers.
 * 
 * Logic to be implemented:
 * - Detects type of Error:
 *   - Mongoose validation/cast error (returns 400 Bad Request, structured messages)
 *   - Duplicate key error (returns 400, e.g. duplicate UTR or Email)
 *   - Zod/validation schema error (returns 400, detailing field errors)
 *   - Custom operational errors (inheriting APIError, returning specific status)
 *   - Generic unhandled program exceptions (returns 500, hides stacks in production)
 * - Logs errors using common logger helper.
 */

const logger = require('../lib/logger');
const apiResponse = require('../utils/apiResponse');

// TODO: Enforce global express signature: (err, req, res, next) => { ... }
// module.exports = errorHandler;
