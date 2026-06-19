/**
 * Orders Model - E-Summit '26
 * 
 * Mongoose schema representing an order, containing purchaser context, multiple attendee ticket assignments, 
 * billing details, UPI payment reference tracking, and system processing history.
 * 
 * Fields to define:
 * - orderId: String (Unique transaction visual ID, e.g. ES26-ORD-XXXXXX)
 * - buyer: Object
 *   - name: String
 *   - email: String
 *   - phone: String
 *   - organization/college: String
 * - attendees: Array of Sub-documents
 *   - name: String
 *   - email: String
 *   - phone: String
 *   - tier: String (Enum: ['general', 'vip', 'premium', etc.])
 *   - passId: String (Reference to issued pass ID, populated after confirmation)
 * - amount: Number (Total order cost)
 *   - subtotal: Number
 *   - discount: Number
 *   - total: Number
 * - status: String (Enum: ['pending_payment', 'pending_verification', 'confirmed', 'rejected', 'expired'])
 * - paymentDetails: Object
 *   - utrNumber: String (Unique bank transaction code submitted by buyer)
 *   - screenshotUrl: String (Uploaded receipt image url)
 *   - verifiedBy: ObjectId (Reference to Admin User who confirmed)
 *   - verifiedAt: Date
 *   - rejectionReason: String
 * - timestamps: true (createdAt, updatedAt)
 * 
 * Indexes:
 * - orderId (unique)
 * - paymentDetails.utrNumber (sparse unique, preventing same receipt usage)
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// TODO: 1. Construct Attendee sub-schema
// TODO: 2. Construct Order schema with sub-schema, validations, and indexes
// TODO: 3. Export Mongoose model 'Order'

module.exports = null; // replace with mongoose.model('Order', OrderSchema);
