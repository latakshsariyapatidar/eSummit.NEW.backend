const crypto = require('crypto');
/**
 * Generates a unique human-readable Pass ID.
 * Example: PAS-MH3K8Q9A-T92NWD
 */
const generatePassId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = crypto
    .randomBytes(4)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 6)
    .toUpperCase();

  return `PAS-${timestamp}-${random}`;
};

module.exports = {generatePassId};