const crypto = require('crypto');

/**
 * Generates a unique human-readable order ID.
 * Example: ORD-MD8K2W9A-X4G7QK
 */
const generateOrderId = () =>{
  const timestamp = Date.now().toString(36).toUpperCase(); // Compact timestamp
  const random = crypto
    .randomBytes(4)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 6)
    .toUpperCase();

  return `ORD-${timestamp}-${random}`;
};

module.exports = {
  generateOrderId,
};