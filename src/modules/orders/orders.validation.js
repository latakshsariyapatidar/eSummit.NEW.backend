/**
 * Orders Validation - E-Summit '26
 * 
 * Defines schemas using Zod for parsing and sanitizing incoming request payloads.
 * Ensures the API rejects invalid email formatting, empty strings, mismatching tiers, 
 * or malformed phone numbers before logic executes.
 * 
 * Schemas to define:
 * - checkoutSchema:
 *   - buyer: object containing name (string), email (email), phone (phone regex), college (string).
 *   - attendees: array of objects containing name, email, phone, tier (valid ticket tiers).
 * - paymentProofSchema:
 *   - utrNumber: string (typically 12 digit numeric sequence, or alphanumeric).
 *   - screenshotUrl: string (URL containing verification upload receipt).
 */

const { z } = require('zod');

// TODO: Design orderSubmitSchema using Zod.
// Fields to validate:
// - phone: String (10 digits)
// - email: String (valid email)
// - gender: String (enum: ['male', 'female', 'other'])
// - order_type: String (enum: ['pass', 'merch'])
// - items: Array of strings
// - payment_utr: String
// - payment_screenshot: String (base64 encoded image)
// - showPassDetails: Boolean
// - pass_details: Array of objects (max 5 items, containing: passType, passPrice, attendeeName, attendeeEmail, attendeeGender, collegeName)

const orderSubmitSchema = z.object({
  // Implement Zod verification fields
});

module.exports = {
  orderSubmitSchema,
};
