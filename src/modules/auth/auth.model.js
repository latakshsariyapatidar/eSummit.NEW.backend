const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getNextSequenceValue } = require('../../common/models/counter.model');

const UserSchema = new Schema({
  ID: {
    type: Number,
    unique: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['admin', 'volunteer'],
    default: 'volunteer',
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function() {
  if (this.isNew && !this.ID) {
    try {
      this.ID = await getNextSequenceValue('User');
    } catch (err) {
      throw err;
    }
  }
});

module.exports = mongoose.model('User', UserSchema);

