const crypto = require('crypto');
const User = require('../auth/auth.model');

class AdminService {
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

  async listKeys() {
    return await User.find({}).sort({ createdAt: -1 });
  }
  
  async deleteKey(id) {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      const error = new Error('Key not found');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }

}

module.exports = new AdminService();

