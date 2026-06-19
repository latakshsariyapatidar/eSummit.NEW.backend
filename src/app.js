/**
 * E-Summit '26 Backend - Express Application Setup
 * 
 * This file is responsible for:
 * 1. Initializing the Express instance.
 * 2. Mounting global security, utility, and parsing middlewares:
 *    - helmet (Security headers)
 *    - cors (Cross-Origin Resource Sharing)
 *    - express.json() & express.urlencoded() (Body parsers)
 *    - cookie-parser (Cookie parsing)
 *    - express-mongo-sanitize (NoSQL injection prevention)
 *    - rateLimiter (DDoS and brute-force prevention)
 *    - requestLogger (HTTP request tracking)
 * 3. Mounting the routers of all functional modules:
 *    - /api/auth       -> auth.routes
 *    - /api/orders     -> orders.routes
 *    - /api/passes     -> passes.routes
 *    - /api/payments   -> payments.routes
 *    - /api/checkin    -> checkin.routes
 *    - /api/content    -> content.routes
 * 4. Handling 404/Not Found requests.
 * 5. Registering the global error handler middleware.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

// Import common configuration and custom middlewares
const env = require('./common/config/env');
const errorHandler = require('./common/middleware/errorHandler');
const rateLimiter = require('./common/middleware/rateLimiter');
const requestLogger = require('./common/middleware/requestLogger');

// Import module routers
const authRouter = require('./modules/auth/auth.routes');
const ordersRouter = require('./modules/orders/orders.routes');
const passesRouter = require('./modules/passes/passes.routes');
const paymentsRouter = require('./modules/payments/payments.routes');
const checkinRouter = require('./modules/checkin/checkin.routes');
const contentRouter = require('./modules/content/content.routes');

const app = express();

// TODO: 1. Setup global middlewares (CORS, Helmet, Parsers, Rate Limiting, Request Logger)
// TODO: 2. Mount API Routes (/api/auth, /api/orders, /api/passes, /api/payments, /api/checkin, /api/content)
// TODO: 3. Handle undefined routes (throw a standard 404 API error)
// TODO: 4. Mount global errorHandler middleware as the final middleware

module.exports = app;
