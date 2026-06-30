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
 *    - /auth       -> auth.routes
 *    - /orders     -> orders.routes
 *    - /passes     -> passes.routes
 *    - /payments   -> payments.routes
 *    - /checkin    -> checkin.routes
 *    - /content    -> content.routes
 * 4. Handling 404/Not Found requests.
 * 5. Registering the global error handler middleware.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Import common configuration and custom middlewares
const env = require('./common/config/env');
const errorHandler = require('./common/middleware/errorHandler');
const rateLimiter = require('./common/middleware/rateLimiter');
const requestLogger = require('./common/middleware/requestLogger');

// Import module routers
const { authRouter, adminRouter } = require('./modules/auth/auth.routes');
const ordersRouter = require('./modules/orders/orders.routes');
const passesRouter = require('./modules/passes/passes.routes');
const paymentsRouter = require('./modules/payments/payments.routes');
const checkinRouter = require('./modules/checkin/checkin.routes');
const contentRouter = require('./modules/content/content.routes');

const app = express();

// Custom MongoDB Injection Sanitizer compatible with Express 5
const mongoSanitize = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.params);
  sanitizeObject(req.query);
  next();
};

// Setup global middleware stubs
app.use(helmet());
app.use(cors({
  origin: '*', // TODO: Configure Access-Control-Allow-Origin according to CORS requirements
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Key'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize);



// TODO: 1. Setup rate limiting and request logger middleware:
app.use(requestLogger);
// app.use('/admin', authLimiter);
// app.use('/order', paymentLimiter);

// TODO: 2. Mount API Routes conforming to endpoints specification:
// - /admin      -> authRouter (Admin Key Verify, DB State, Verify Order, Screenshot, passes config)
// - /order      -> ordersRouter (Submit Order, Order Status)
// - /attendance -> checkinRouter (Verify QR, Mark Attendance)
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/order', ordersRouter);
app.use('/attendance', checkinRouter);
app.use('/content', contentRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: Date.now(),
  });
});

// TODO: 3. Handle undefined routes (throw a standard 404 API error)
app.use((req, res, next) => {
  const err = new Error('Endpoint not found');
  err.statusCode = 404;
  next(err);
});

// TODO: 4. Mount global errorHandler middleware as the final middleware
app.use(errorHandler);

module.exports = app;
