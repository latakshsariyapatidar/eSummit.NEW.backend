const { z } = require('zod');
const { GENDERS } = require('./orders.constants');

/**
 * Individual attendee/pass validation
 */
const passRequestSchema = z.object({
  eventName: z
    .string({
      required_error: 'Event name is required',
    })
    .trim()
    .min(1, 'Event name is required'),

  passType: z
    .string({
      required_error: 'Pass type is required',
    })
    .trim()
    .min(1, 'Pass type is required'),

  passPrice: z
    .number({
      required_error: 'Pass price is required',
    })
    .positive('Pass price must be greater than zero'),

  attendeeName: z
    .string({
      required_error: 'Attendee name is required',
    })
    .trim()
    .min(2, 'Attendee name is required'),

  attendeeEmail: z
    .string({
      required_error: 'Attendee email is required',
    })
    .trim()
    .email('Invalid attendee email'),

  attendeeGender: z.enum(GENDERS, {
    errorMap: () => ({
      message: `Gender must be one of: ${GENDERS.join(', ')}`,
    }),
  }),

  collegeName: z
    .string({
      required_error: 'College name is required',
    })
    .trim()
    .min(2, 'College name is required'),
});

/**
 * POST /orders/submit
 */
const submitOrderSchema = z.object({
  cartValue: z
    .number({
      required_error: 'Cart value is required',
    })
    .positive('Cart value must be greater than zero'),

  passes: z
    .array(passRequestSchema)
    .min(1, 'At least one pass is required'),
});

/**
 * POST /orders/utr
 */
const submitUTRSchema = z.object({
  orderId: z
    .string({
      required_error: 'Order ID is required',
    })
    .trim()
    .min(1),

  /**
   * Most UTRs are between 12–22 digits depending on the bank.
   */
  utr: z
    .string({
      required_error: 'UTR is required',
    })
    .trim()
    .regex(/^[A-Za-z0-9]{10,30}$/, 'Invalid UTR format'),

  /**
   * Optional payment screenshot.
   */
  paymentScreenshot: z
    .string()
    .optional(),
});

/**
 * POST /orders/admin/:orderId/approve
 */
const approveOrderSchema = z.object({
  orderId: z
    .string({
      required_error: 'Order ID is required',
    })
    .trim(),
});

/**
 * POST /orders/admin/:orderId/reject
 */
const rejectOrderSchema = z.object({
  orderId: z
    .string({
      required_error: 'Order ID is required',
    })
    .trim(),

  reason: z
    .string({
      required_error: 'Rejection reason is required',
    })
    .trim()
    .min(5, 'Please provide a valid rejection reason'),
});

module.exports = {
  submitOrderSchema,
  submitUTRSchema,
  approveOrderSchema,
  rejectOrderSchema,
};