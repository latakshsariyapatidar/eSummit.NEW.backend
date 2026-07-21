/**
 * QR Service - E-Summit '26 (Payments Module)
 *
 * Pure business logic for QR generation. No req/res here — keeps this
 * reusable (e.g. if a webhook or cron job ever needs to regenerate a QR).
 *
 * - generatePaymentQr: builds a UPI deep-link string (upi://pay?...) using a
 *   randomly picked VPA from env, renders it as a base64 QR (data URI).
 *   Scanning it opens the user's UPI app with the payee + amount pre-filled.
 * - generatePassQr: embeds { passId, orderId } as JSON inside the QR, used
 *   by gate/entry scanners to validate a pass.
 *
 * Dependency: `qrcode` (npm install qrcode) — generates QR images locally,
 * no external API calls, no image hosting required.
 */

const QRCode = require('qrcode');
const env = require('../../common/config/env');

/**
 * UPI_VPAS is expected as a comma-separated list in env, e.g.:
 *   UPI_VPAS=esummit1@okhdfcbank,esummit2@okicici,esummit3@oksbi
 *
 * Falls back to UPI_VPA only when UPI_VPAS is not configured.
 */
const parseVpas = (...values) => {
  const vpas = values
    .filter(Boolean)
    .flatMap((value) => value.split(/[,\n;|]+/))
    .map((id) => id.trim())
    .filter(Boolean);

  return [...new Set(vpas)];
};

const UPI_VPAS = parseVpas(env.UPI_VPAS || env.UPI_VPA);

if (UPI_VPAS.length === 0) {
  throw new Error(
    'No UPI VPA configured. Set UPI_VPAS (comma-separated) or UPI_VPA in env.'
  );
}

let nextVpaIndex = 0;

const pickNextVpa = () => {
  const vpa = UPI_VPAS[nextVpaIndex];
  nextVpaIndex = (nextVpaIndex + 1) % UPI_VPAS.length;
  return vpa;
};

const QR_RENDER_OPTIONS = {
  errorCorrectionLevel: 'M',
  type: 'image/png',
  margin: 1,
  width: 400,
};

/**
 * Builds a standard UPI deep-link URI.
 * pa = payee VPA, pn = payee name, am = amount, cu = currency,
 * tn = transaction note, tr = transaction ref (useful for reconciliation).
 */
const buildUpiLink = ({ vpa, payeeName, amount, orderId }) => {
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: Number(amount).toFixed(2),
    cu: env.UPI_CURRENCY || 'INR',
    tn: `EST26-${orderId}`,
    tr: String(orderId),
  });

  return `upi://pay?${params.toString()}`;
};

const badRequest = (message) => {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
};

/**
 * @param {{ cartPrice: number|string, orderId: string }} payload
 * @returns {Promise<{ orderId: string, qrBase64: string, vpa: string }>}
 */
const generatePaymentQr = async ({ cartPrice, orderId }) => {
  const amount = Number(cartPrice);

  if (!cartPrice || Number.isNaN(amount) || amount <= 0) {
    throw badRequest('cartPrice must be a positive number');
  }
  if (!orderId) {
    throw badRequest('orderId is required');
  }

  const vpa = pickNextVpa();

  const upiLink = buildUpiLink({
    vpa,
    payeeName: env.UPI_MERCHANT_NAME,
    amount,
    orderId,
  });

  const qrBase64 = await QRCode.toDataURL(upiLink, QR_RENDER_OPTIONS);

  return { orderId, qrBase64, vpa };
};

/**
 * @param {{ passId: string, orderId: string }} payload
 * @returns {Promise<{ passId: string, orderId: string, qrBase64: string }>}
 */
const generatePassQr = async ({ passId, orderId }) => {
  if (!passId) {
    throw badRequest('passId is required');
  }
  if (!orderId) {
    throw badRequest('orderId is required');
  }

  // JSON payload keeps this parseable on the scanner side without needing
  // a delimiter convention (e.g. "passId|orderId").
  const payload = JSON.stringify({ passId, orderId });

  const qrBase64 = await QRCode.toDataURL(payload, QR_RENDER_OPTIONS);

  return { passId, orderId, qrBase64 };
};

module.exports = {
  generatePaymentQr,
  generatePassQr,
};
