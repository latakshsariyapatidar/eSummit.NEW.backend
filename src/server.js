/**
 * E-Summit '26 Backend - Server Entry Point
 * 
 * This file is responsible for:
 * 1. Loading environment variables and running validation checks.
 * 2. Connecting to MongoDB (utilizing Mongoose config from common/config/db).
 * 3. Starting the Express HTTP server and listening on the configured PORT.
 * 4. Listening for system events and process terminations to perform graceful shutdown:
 *    - Close database connection.
 *    - Close HTTP server.
 * 5. Catching unhandled promise rejections and uncaught exceptions to log and exit safely.
 */

const dotenv = require('dotenv');

// Load environment variables early in the lifecycle
dotenv.config();

const app = require('./app');
const env = require('./common/config/env');
const connectDB = require('./common/config/db');
const logger = require('./common/lib/logger');

connectDB();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// TODO: 1. Initialize database connection via connectDB()
// TODO: 2. Bind application port and start listening (server.listen(PORT, ...))
// TODO: 3. Setup listeners for uncaughtException and unhandledRejection
// TODO: 4. Implement graceful shutdown handlers for SIGTERM/SIGINT signals
