/**
 * User Model - E-Summit '26
 * 
 * Fields to define:
 * - ID: Number (Unique, auto-increment integer ID)
 * - Email: String (Unique email, lowercase, indexed)
 * - Phone: String (10 digit phone number)
 * - Name: String (User's full name)
 * - Gender: String (Enum: ['male', 'female', 'other'])
 * - Timestamps: CreatedAt, UpdatedAt (ISO 8601 strings)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // TODO: Implement fields: ID (Number, unique), Email (String, unique, required), Phone (String, required), Name (String, required), Gender (String, enum: ['male', 'female', 'other'], required)
  // Ensure timestamps are enabled (CreatedAt, UpdatedAt mapping)
});

module.exports = mongoose.model('User', UserSchema);
