const express = require('express');
const { login, register } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;
