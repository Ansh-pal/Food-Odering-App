const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    country: {
      type: String,
      required: true,
      enum: ['India', 'America'],
      index: true
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'placed', 'cancelled'],
      default: 'draft',
      index: true
    },
    paymentSnapshot: {
      type: {
        type: String,
        enum: ['card', 'upi', 'wallet']
      },
      provider: String,
      last4: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
