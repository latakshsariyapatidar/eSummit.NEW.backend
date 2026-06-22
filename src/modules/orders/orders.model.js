/**
 * Orders Model - E-Summit '26
 * 
 * Fields to define:
 * - ID: Number (Unique, auto-increment integer ID)
 * - UserID: Number (Reference to User.ID)
 * - Status: String (Enum: ['pending', 'verified', 'rejected'], default: 'pending')
 * - OrderType: String (Enum: ['pass', 'merch'])
 * - PaymentUTR: String (Unique transaction reference)
 * - PaymentSSPath: String (Screenshot path)
 * - Items: Array of strings
 * - Amount: Number
 * - Timestamps: CreatedAt, UpdatedAt (ISO 8601 strings)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  // TODO: Implement fields:
  // - ID: Number (unique)
  // - UserID: Number (required)
  // - Status: String (enum: ['pending', 'verified', 'rejected'], default: 'pending')
  // - OrderType: String (enum: ['pass', 'merch'], required)
  // - PaymentUTR: String (required, unique)
  // - PaymentSSPath: String (required)
  // - Items: [String] (required)
  // - Amount: Number (required)
  // Ensure timestamps are enabled (CreatedAt, UpdatedAt mapping)
});

module.exports = mongoose.model('Order', OrderSchema);
