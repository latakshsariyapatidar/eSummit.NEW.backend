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

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Zod validation error
  if (err.name === 'ZodError' || err.issues || err.constructor?.name === 'ZodError') {
    statusCode = 400;
    const issues = err.issues || err.errors || [];
    message = issues.map((e) => `${(e.path || []).join('.')}: ${e.message}`).join(', ') || err.message || 'Validation failed';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  return apiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
