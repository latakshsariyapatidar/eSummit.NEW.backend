const mongoose = require('mongoose');
const {
  ORDER_STATUS,
  GENDERS,
} = require('./orders.constants');

/**
 * Snapshot of a pass purchase.
 * This represents exactly what the customer purchased.
 * These records are never modified after order creation.
 */
const passRequestSchema = new mongoose.Schema(
  {
    passType: {
      type: String,
      required: true,
      trim: true,
    },
    passPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    attendeeName: {
      type: String,
      required: true,
      trim: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    attendeeGender: {
      type: String,
      required: true,
      enum: GENDERS,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
  },
);

/**
 * Tracks every state transition of an order.
 */
const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true,
    },

    at: {
      type: Date,
      default: Date.now,
    },

    by: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    /**
     * Human readable order ID.
     * Example:
     * ORD000123
     */
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /**
     * Grand total.
     */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Current workflow status.
     */
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },

    /**
     * UTR submitted by customer.
     */
    paymentUTR: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    /**
     * Optional screenshot.
     */
    paymentScreenshot: {
      type: String,
      default: null,
    },

    /**
     * UPI VPA used to generate this order's payment QR.
     */
    paymentUPI: {
      type: String,
      trim: true,
      default: null,
    },

    /**
     * Immutable purchase snapshot.
     */
    passRequests: {
      type: [passRequestSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'At least one pass is required.',
      },
    },

    /**
     * Generated passes after approval.
     */
    passes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pass',
      },
    ],

    /**
     * Order expires after 30 minutes.
     */
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    /**
     * Audit
     */
    verifiedBy: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: String,
      default: null,
    },

    rejectedReason: {
      type: String,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    /**
     * Status history.
     */
    history: {
      type: [historySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


module.exports = mongoose.model('Order', orderSchema);
