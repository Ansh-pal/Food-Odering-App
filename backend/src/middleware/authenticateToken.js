const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Bearer token is required.'
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User does not exist.'
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      role: user.role,
      country: user.country,
      paymentMethod: user.paymentMethod
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid or expired token.'
    });
  }
};

module.exports = authenticateToken;
