/**
 * SMS Provider - E-Summit '26
 * 
 * Wrapper interfacing with SMS Gateway providers (e.g. Twilio, Fast2SMS, or custom HTTP integrations).
 * Used to dispatch short ticket codes or OTP verification codes directly to attendees' phone numbers.
 * 
 * Core responsibilities:
 * - sendSms(to, message)
 *   - Formats phone numbers.
 *   - Compiles headers/payload (API key, sender ID, route details).
 *   - Sends post request to SMS provider URL.
 */

const env = require('../../../common/config/env');
const logger = require('../../../common/lib/logger');

const sendSms = async (to, message) => {
  // TODO: Implement custom HTTP post or API client connection to dispatch text messages.
  logger.info(`[SMS Mock] Sending to: ${to}, Message: ${message}`);
  return { success: true };
};

module.exports = { sendSms };
