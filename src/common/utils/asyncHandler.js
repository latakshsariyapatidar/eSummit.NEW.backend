/**
 * Async Handler Wrapper - E-Summit '26
 *
 * Simple higher-order function that wraps asynchronous routes to automatically
 * forward any rejected Promises to the global Express next(err) handler.
 * Prevents repeating boilerplate try-catch blocks in controllers.
 *
 * Usage:
 * const myControllerAction = asyncHandler(async (req, res, next) => { ... });
 */

const asyncHandler = (fn) => (req, res, next) => {
  // TODO: Wrap controller functions to automatically forward Promise catches to next(err)
  Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncHandler;
