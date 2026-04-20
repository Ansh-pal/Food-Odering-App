const mongoose = require('mongoose');

const User = require('../models/User');

const updatePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, provider, last4 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id'
      });
    }

    if (!type || !provider || !last4) {
      return res.status(400).json({
        success: false,
        message: 'type, provider, and last4 are required'
      });
    }

    if (!['card', 'upi', 'wallet'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'type must be one of card, upi, wallet'
      });
    }

    const normalizedLast4 = String(last4).trim();
    if (!/^\d{4}$/.test(normalizedLast4)) {
      return res.status(400).json({
        success: false,
        message: 'last4 must be exactly 4 digits'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.paymentMethod = {
      type,
      provider: String(provider).trim(),
      last4: normalizedLast4
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Payment method updated successfully',
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        country: user.country,
        paymentMethod: user.paymentMethod
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updatePaymentMethod
};
