const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      enum: ['India', 'America']
    },
    cuisine: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

restaurantSchema.index({ country: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
