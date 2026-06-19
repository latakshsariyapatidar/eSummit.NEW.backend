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

// TODO: Create Response formatting helper class or object exports
// module.exports = ApiResponse;
