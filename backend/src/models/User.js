const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['card', 'upi', 'wallet'],
      default: 'card'
    },
    provider: {
      type: String,
      default: 'Visa'
    },
    last4: {
      type: String,
      default: '0000'
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'manager', 'member']
    },
    country: {
      type: String,
      required: true,
      enum: ['India', 'America']
    },
    paymentMethod: {
      type: paymentMethodSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, country: 1 });

module.exports = mongoose.model('User', userSchema);
