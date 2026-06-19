/**
 * Passes Model - E-Summit '26
 * 
 * Schema tracking individual entry passes. Each pass is tied to a specific buyer/attendee from an Order.
 * 
 * Fields to define:
 * - passId: String (Unique ticket code, e.g. ES26-PASS-XXXX-YYYY, generated on order confirmation)
 * - orderId: ObjectId (Reference to Parent Order)
 * - attendeeIndex: Number (Position of attendee in the order.attendees list)
 * - tier: String (Enum: ['general', 'vip', 'premium', etc.])
 * - status: String (Enum: ['reserved', 'active', 'revoked'])
 * - generatedAt: Date
 * - revokedAt: Date
 * - revokingReason: String
 * 
 * Indexes:
 * - passId (unique)
 * - orderId
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: 1. Design PassSchema with unique indexes
// TODO: 2. Export Mongoose model 'Pass'

module.exports = null; // replace with mongoose.model('Pass', PassSchema);
