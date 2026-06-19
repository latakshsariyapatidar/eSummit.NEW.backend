/**
 * Auth Model - E-Summit '26
 * 
 * Defines the Mongoose database schema for E-Summit users (Admins, Sub-Admins, and gate Volunteers).
 * 
 * Fields to define:
 * - name: String (Full name of volunteer/admin)
 * - email: String (Unique email, formatted, lowercase, indexed)
 * - password: String (Hashed password stored securely)
 * - role: String (Enum: ['admin', 'volunteer', 'sub-admin'])
 * - isActive: Boolean (Enable/disable credentials to revoke access)
 * - permissions: Array of strings (Granular capabilities if required)
 * - resetPasswordToken: String (Hash of password reset token)
 * - resetPasswordExpires: Date (TTL of password reset token)
 * - lastLogin: Date (Track login activity)
 * 
 * Pre-save hooks:
 * - Automatically hash password using bcrypt if modified.
 * 
 * Model methods:
 * - comparePassword(candidatePassword) -> Returns true if password matches.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// TODO: 1. Design UserSchema with indexes and validation
// TODO: 2. Add pre-save hook to hash password (using bcrypt)
// TODO: 3. Add instance method `comparePassword` to verify logins
// TODO: 4. Export Mongoose model 'User'

module.exports = null; // replace with mongoose.model('User', UserSchema);
