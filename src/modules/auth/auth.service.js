/**
 * Auth Service - E-Summit '26
 * 
 * Implements business logical functions related to credentials check, user creation,
 * security tokens generation, password resets, and session management.
 * 
 * Core responsibilities:
 * - authenticateUser(email, password)  -> Look up user, verify argon2/bcrypt password hash, generate JWT.
 * - registerUser(userData, actorRole)  -> Create user record in DB, hash password before saving.
 * - generateSessionToken(userId, role) -> Signs standard JWT containing identifier information.
 * - verifySessionToken(token)          -> Decodes and validates JWT expiration, signatures, and user status.
 * - initiatePasswordReset(email)       -> Creates reset token with short TTL, saves in DB, triggers mail notification.
 * - performPasswordReset(token, newPass)-> Verifies reset token, hashes new password, updates user model.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./auth.model');
const env = require('../../common/config/env');

class AuthService {
  /**
   * Authenticate key and return a token and role.
   */
  async authenticateKey(key) {
    if (!key) {
      const error = new Error('Access key is required');
      error.statusCode = 400;
      throw error;
    }

    // 1. Check if it matches the pre-shared Admin Key
    if (key === env.ADMIN_KEY) {
      const token = this.generateSessionToken(0, 'admin', key);
      return { token, role: 'admin', keyUsed: key };
    }

    // 2. Query database for volunteer or custom admin keys
    const userKey = await User.findOne({ key });
    if (!userKey) {
      const error = new Error('Invalid access key');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateSessionToken(userKey.ID, userKey.role);
    return { token, role: userKey.role};
  }

  /**
   * Generate a volunteer key.
   */
  async generateVolunteerKey() {
    // Generate an 8-character uppercase hexadecimal key
    const key = crypto.randomBytes(4).toString('hex').toUpperCase();

    const userKey = new User({
      key,
      role: 'volunteer',
    });

    await userKey.save();
    return userKey;
  }

  /**
   * List all keys stored in the database.
   */
  async listKeys() {
    return await User.find({}).sort({ createdAt: -1 });
  }

  /**
   * Revoke/delete a key by its database ID.
   */
  async deleteKey(id) {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      const error = new Error('Key not found');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }

  /**
   * Generate JWT session token valid for 30 days.
   */
  generateSessionToken(userId, role) {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  /**
   * Verify and decode a JWT session token.
   */
  verifySessionToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch {
      const err = new Error('Invalid or expired session token');
      err.statusCode = 401;
      throw err;
    }
  }
}

module.exports = new AuthService();

