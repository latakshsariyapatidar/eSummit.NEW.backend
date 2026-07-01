/**
 * QR Controller - E-Summit '26 (Payments Module)
 *
 * Thin layer: pulls data off req, delegates to qr.service, formats the
 * response via apiResponse. No QR/UPI logic lives here.
 */

const asyncHandler = require('../../common/utils/asyncHandler');
const apiResponse = require('../../common/utils/apiResponse');
const qrService = require('./qr.service');

/**
 * POST /payment
 * body: { cartPrice: number, orderId: string }
 * -> { orderId, qrBase64 }
 */
const generatePaymentQr = asyncHandler(async (req, res) => {
  const { cartPrice, orderId } = req.body;

  const result = await qrService.generatePaymentQr({ cartPrice, orderId });

  return apiResponse.success(res, result, 'Payment QR generated successfully', 200);
});

/**
 * POST /pass
 * body: { passId: string, orderId: string }
 * -> { passId, orderId, qrBase64 }
 */
const generatePassQr = asyncHandler(async (req, res) => {
  const { passId, orderId } = req.body;

  const result = await qrService.generatePassQr({ passId, orderId });

  return apiResponse.success(res, result, 'Pass QR generated successfully', 200);
});

module.exports = {
  generatePaymentQr,
  generatePassQr,
};