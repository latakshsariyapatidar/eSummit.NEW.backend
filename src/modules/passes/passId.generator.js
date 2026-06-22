/**
 * Pass ID Generator - E-Summit '26
 * 
 * Utility functions for generating unique ticket identifiers.
 * The IDs should be:
 * 1. Safe from enumeration attacks (not sequential IDs like 1, 2, 3).
 * 2. Short enough to easily print on physical badges/QRs and read by volunteers.
 * 3. Structured to identify E-Summit tier details if possible (e.g. prefixing or suffixing).
 * 
 * Logic to be implemented:
 * - generatePassId(tier)
 *   - Creates a random alphanumeric string with format: ES26-[TIER-CODE]-[RANDOM-CHARS]
 *   - Verifies against Database to ensure absolute uniqueness (fallback collisions prevention).
 */

const crypto = require('crypto');
const Pass = require('./passes.model');

const generatePassId = async (tier) => {
  // TODO: Implement unique ticket/pass ID generator
  // - Creates a random alphanumeric string with format: ES26-[TIER-CODE]-[RANDOM-CHARS]
  // - Verifies against Database to ensure absolute uniqueness (fallback collisions prevention).
  return `ES26-${(tier || 'GEN').substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

module.exports = { generatePassId };
