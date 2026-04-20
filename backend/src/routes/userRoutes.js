const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { updatePaymentMethod } = require('../controllers/userController');

const router = express.Router();

router.use(authenticateToken);

router.patch('/:id/payment-method', authorizeRoles('admin'), updatePaymentMethod);

module.exports = router;
