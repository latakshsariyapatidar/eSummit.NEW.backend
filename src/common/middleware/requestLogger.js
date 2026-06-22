/**
 * Request Logger Middleware - E-Summit '26
 * 
 * Intercepts incoming queries to trace HTTP requests.
 * Prints out standard log details: method, URL, status code, response time, and IP.
 * Integrates with common logger utility.
 */

const logger = require('../lib/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms [IP: ${req.ip}]`);
  });
  next();
};
module.exports = requestLogger;
