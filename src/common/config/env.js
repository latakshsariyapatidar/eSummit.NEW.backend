/**
 * Environment Validation - E-Summit '26
 * 
 * Defines the structural schema for environment variables using Zod.
 * Ensures the application fails immediately upon boot if critical environment keys
 * (such as database URIs, JWT secrets, or payment credentials) are missing or misconfigured.
 * 
 * Validation schemas to define:
 * - schema:
 *   - PORT (number)
 *   - NODE_ENV (enum: ['development', 'production', 'test'])
 *   - MONGODB_URI (url/string)
 *   - JWT_SECRET (string)
 *   - JWT_EXPIRES_IN (string)
 *   - UPI_VPA (string/email format)
 *   - UPI_MERCHANT_NAME (string)
 *   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 */

const { z } = require('zod');

// TODO: 1. Design environment variable schema using Zod
// TODO: 2. Parse process.env against schema, catch error and log detailing exactly what key is missing
// TODO: 3. Export validated values

module.exports = process.env; // Temporary export to prevent crash, replace with validated object
