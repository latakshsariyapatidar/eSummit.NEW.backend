/**
 * Database Connection - E-Summit '26
 * 
 * Establishes a persistent connection to MongoDB using Mongoose.
 * Logs event notifications and binds shutdown behaviors.
 * 
 * Logic to be implemented:
 * - connectDB():
 *   - Calls mongoose.connect() with the validated MONGODB_URI.
 *   - Binds connection listener events:
 *     - 'connected' -> Log successful initialization.
 *     - 'error'     -> Log failure details and exit app.
 *     - 'disconnected' -> Log alert indicating database loss.
 */

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../lib/logger');

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose default connection open to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose default connection error: ' + err);
      process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose default connection disconnected');
    });

    await mongoose.connect(env.MONGODB_URI);
  } catch (err) {
    logger.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
