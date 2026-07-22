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
 *    - /content    -> content.routes
 * 4. Handling 404/Not Found requests.
 * 5. Registering the global error handler middleware.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Import common configuration and custom middlewares
const errorHandler = require('./common/middleware/errorHandler');
const rateLimiter = require('./common/middleware/rateLimiter');
const requestLogger = require('./common/middleware/requestLogger');

// Import module routers
const authRouter = require('./modules/auth/auth.routes');
const adminRouter = require('./modules/admin/admin.route');
const ordersRouter = require('./modules/orders/orders.routes');
const passesRouter = require('./modules/passes/pass.routes');
const contentRouter = require('./modules/content/content.routes');

const app = express();

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

const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'http://localhost:3000', // Local dev alt
  'http://iic.iitdh.ac.in',
  'https://iic.iitdh.ac.in',
  process.env.FRONTEND_URL, // From env var
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {return callback(null, true);}

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'X-Admin-Key', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  }),
);

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize);

// Setup request logger middleware:
app.use(requestLogger);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/content', contentRouter);
app.use('/api/passes', passesRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: Date.now(),
  });
});

// Handle undefined routes (throw a standard 404 API error)
app.use((req, res, next) => {
  const err = new Error('Endpoint not found');
  err.statusCode = 404;
  next(err);
});

// Mount global errorHandler middleware as the final middleware
app.use(errorHandler);

module.exports = app;
