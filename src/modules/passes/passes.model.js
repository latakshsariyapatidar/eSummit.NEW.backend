/**
 * Passes Model - E-Summit '26
 * 
 * Fields to define:
 * - ID: Number (Unique, auto-increment integer ID)
 * - OrderID: Number (Reference to Order.ID)
 * - PassType: String (Pass name, e.g. '1 Day Visitor Pass')
 * - PassPrice: Number
 * - AttendeeName: String
 * - AttendeeEmail: String
 * - AttendeeGender: String
 * - CollegeName: String
 * - QRCode: String (Unique ticket QR content, e.g. ES26-XXX-XXXXXX)
 * - IsPresent: Boolean (default: false)
 * - AttendedAt: Date (nullable, timestamp of check-in)
 * - CreatedAt: Date
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassSchema = new Schema({
  // TODO: Implement fields:
  // - ID: Number (unique)
  // - OrderID: Number (required)
  // - PassType: String (required)
  // - PassPrice: Number (required)
  // - AttendeeName: String (required)
  // - AttendeeEmail: String (required)
  // - AttendeeGender: String (required)
  // - CollegeName: String (required)
  // - QRCode: String (required, unique)
  // - IsPresent: Boolean (default: false)
  // - AttendedAt: Date (default: null)
  // Ensure CreatedAt timestamp is auto-generated
});

module.exports = mongoose.model('Pass', PassSchema);
