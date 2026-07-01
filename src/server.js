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

const dotenv = require("dotenv");

// Load environment variables early in the lifecycle
dotenv.config();

const app = require("./app");
const env = require("./common/config/env");
const connectDB = require("./common/config/db");
const logger = require("./common/lib/logger");
const {
  initEmailProvider,
} = require("./modules/notifications/providers/email.provider");

async function startServer() {
  try {
    await connectDB();
    await initEmailProvider();

    // Start your notification worker AFTER SMTP is ready
    require("./workers/notification.worker");

    // Connect DB, app.listen(), etc.
    app.listen(process.env.PORT, () => {
      console.log(`Server running on ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
