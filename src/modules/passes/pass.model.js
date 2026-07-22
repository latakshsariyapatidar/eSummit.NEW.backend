const mongoose = require('mongoose');

const PASS_STATUS = Object.freeze({
  ACTIVE: 'active',
  USED: 'used',
  CANCELLED: 'cancelled',
});

const passSchema = new mongoose.Schema(
  {
    /**
     * Human-readable pass ID.
     * Example:
     * PASS000123
     */
    passId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /**
     * Parent Order.
     */
    orderId: {
      type: String,
      required: true,
      index: true,
    },

    /**
     * Reference to the Order document.
     */
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },

    /**
     * Pass Details
     */
    type: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Attendee Details
     */
    attendeeName: {
      type: String,
      required: true,
      trim: true,
    },

    attendeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    attendeeGender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * QR Code
     *
     * Stored as Base64.
     */
    qr: {
      type: String,
      required: true,
    },

    /**
     * Pass State
     */
    status: {
      type: String,
      enum: Object.values(PASS_STATUS),
      default: PASS_STATUS.ACTIVE,
      index: true,
    },

    /**
     * Entry Tracking
     */
    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    checkedInBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = {
  Pass: mongoose.model('Pass', passSchema),
  PASS_STATUS,
};