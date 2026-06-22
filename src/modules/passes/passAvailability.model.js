const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Implement PassAvailability Schema conforming to Section 6.4:
// Fields:
// - ID: Number (PK, unique, e.g. 1-4)
// - Name: String (Pass name)
// - Description: String (Pass description)
// - Price: Number (Price in INR)
// - SoldOut: Boolean (Whether this pass type is sold out)
// - UpdatedAt: Date (Timestamp of last availability change)

const PassAvailabilitySchema = new Schema({
  ID: { type: Number, required: true, unique: true },
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Price: { type: Number, required: true },
  SoldOut: { type: Boolean, default: false },
  Available: { type: Boolean, default: true },
}, {
  timestamps: {
    createdAt: false,
    updatedAt: 'UpdatedAt',
  },
});

module.exports = mongoose.model('PassAvailability', PassAvailabilitySchema);
