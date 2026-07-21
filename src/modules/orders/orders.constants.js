/**
 * Orders Constants - E-Summit '26
 *
 * Centralized constants for the Orders module.
 * Prevents hardcoded strings across services, controllers and models.
 */

/**
 * Order Status Lifecycle
 *
 * pending
 *    ↓
 * payment_submitted
 *    ↓
 * verified
 *
 * OR
 *
 * payment_submitted
 *    ↓
 * rejected
 *
 * OR
 *
 * pending
 *    ↓
 * cancelled
 */
const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  PAYMENT_SUBMITTED: 'payment_submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
});

/**
 * Default order expiry time.
 *
 * Orders remaining unpaid beyond this duration should
 * automatically be marked as cancelled.
 *
 * Unit: Minutes
 */
const ORDER_EXPIRY_MINUTES = 30;

/**
 * Allowed genders for attendee registration.
 */
const GENDERS = Object.freeze([
  'Male',
  'Female',
  'Other',
]);

/**
 * History Event Types
 *
 * Used while appending status history.
 */
const HISTORY_ACTIONS = Object.freeze({
  CREATED: 'created',
  PAYMENT_SUBMITTED: 'payment_submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
});

/**
 * Admin Actions
 */
const ADMIN_ACTIONS = Object.freeze({
  APPROVE: 'approve',
  REJECT: 'reject',
});

module.exports = {
  ORDER_STATUS,
  ORDER_EXPIRY_MINUTES,
  GENDERS,
  HISTORY_ACTIONS,
  ADMIN_ACTIONS,
};