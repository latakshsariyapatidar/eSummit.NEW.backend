/**
 * Check-in Model - E-Summit '26
 * 
 * Schema logging audit check-in events at the venue gates.
 * Ensures the system knows when and by whom a specific pass was scanned.
 * 
 * Fields to define:
 * - passId: String (The scanned pass unique ID, indexed for performance)
 * - scannedAt: Date (Defaults to Date.now)
 * - scannedBy: ObjectId (Reference to the Volunteer User who performed the scan)
 * - gateId: String (Optional identifier for the check-in gate/location)
 * 
 * Indexes:
 * - passId (non-unique index, as check-in attempts might be repeated, although successful ones are restricted)
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: 1. Design CheckInSchema with appropriate indices
// TODO: 2. Export Mongoose model 'CheckIn'

module.exports = null; // replace with mongoose.model('CheckIn', CheckInSchema);
