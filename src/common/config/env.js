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

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  UPI_VPA: z.string().min(1, 'UPI_VPA is required'),
  UPI_MERCHANT_NAME: z.string().min(1, 'UPI_MERCHANT_NAME is required'),
  UPI_CURRENCY: z.string().default('INR'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  ADMIN_KEY: z.string().default('adminkey'),
});

let env;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Environment validation failed:', error.format());
  process.exit(1);
}

module.exports = env;
