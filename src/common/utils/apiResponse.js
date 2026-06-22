/**
 * API Response Class Helpers - E-Summit '26
 *
 * Enforces unified JSON payload formatting across all module controllers.
 *
 * Standard payload format:
 * {
 *   success: Boolean,
 *   message: String,
 *   data: Object | Array | null,
 *   errors: Array | null (for validation outputs)
 * }
 *
 * Methods to define:
 * - success(res, message, data, statusCode) -> Sends standardized 2xx success payload.
 * - error(res, message, statusCode, errors)   -> Sends standardized 4xx/5xx error payload.
 */

const apiResponse = {
  // TODO: Implement success helper.
  // Requirements:
  // - Enforce standard success response structure:
  //   { "status": "success", "data": { ... }, "message": "optional" }
  success: (res, data = null, message = undefined, statusCode = 200) => {
    const payload = { status: 'success' };
    if (data !== null) payload.data = data;
    if (message !== undefined) payload.message = message;
    return res.status(statusCode).json(payload);
  },

  // TODO: Implement error helper.
  // Requirements:
  // - Enforce standard error response structure:
  //   { "status": "error", "message": "Human-readable description" }
  error: (res, message = 'Something went wrong', statusCode = 500) => {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }
};

module.exports = apiResponse;
