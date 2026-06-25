/**
 * System Logger - E-Summit '26
 *
 * Shared logging utility. Standardizes log messages printed to console
 * or written to cloud logger streams.
 *
 * Capabilities to implement:
 * - log levels: info, warn, error, debug
 * - console coloring for readability during development
 * - automatic timestamps and error object stack-trace serialization
 */

// TODO: Create a console logger or wrap winston/pino.
// Requirements:
// - Implement info, warn, error, debug log levels
// - Console coloring for readability during development
// - Automatic timestamps and error object stack-trace serialization
const logger = {
  info: (...args) => console.log(`\x1b[32m[INFO]\x1b[0m ${new Date().toISOString()}:`, ...args),
  warn: (...args) => console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()}:`, ...args),
  error: (...args) => {
    const timestamp = new Date().toISOString();
    if (args[0] instanceof Error) {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp}:`, args[0].stack, ...args.slice(1));
    } else {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${timestamp}:`, ...args);
    }
  },
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`\x1b[36m[DEBUG]\x1b[0m ${new Date().toISOString()}:`, ...args);
    }
  },
};

module.exports = logger;
