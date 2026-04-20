const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/User');

const buildAuthPayload = (user) => ({
  userId: user._id.toString(),
  role: user.role,
  country: user.country,
  name: user.name,
  username: user.username
});

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  role: user.role,
  country: user.country,
  paymentMethod: user.paymentMethod
});

const signToken = (user) =>
  jwt.sign(buildAuthPayload(user), env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username and password are required'
      });
    }

    const normalizedUsername = String(username).trim().toLowerCase();

    const user = await User.findOne({ username: normalizedUsername });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: buildUserResponse(user)
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, username, password, country } = req.body;

    if (!name || !username || !password || !country) {
      return res.status(400).json({
        success: false,
        message: 'name, username, password, and country are required'
      });
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedCountry = String(country).trim();

    if (!['India', 'America'].includes(normalizedCountry)) {
      return res.status(400).json({
        success: false,
        message: 'country must be either India or America'
      });
    }

    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      username: normalizedUsername,
      password,
      role: 'member',
      country: normalizedCountry,
      paymentMethod: {
        type: 'card',
        provider: '',
        last4: '0000'
      }
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: buildUserResponse(user)
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    return next(error);
  }
};

module.exports = {
  login,
  register
};
