const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const {
  createOrder,
  addItemToOrder,
  checkoutOrder,
  cancelOrder,
  getOrders,
  getOrderById
} = require('../controllers/orderController');

const router = express.Router();

router.use(authenticateToken);

router.post('/', authorizeRoles('admin', 'manager', 'member'), createOrder);

router.get('/', authorizeRoles('admin', 'manager', 'member'), getOrders);

router.get('/:id', authorizeRoles('admin', 'manager', 'member'), getOrderById);

router.post('/:id/items', authorizeRoles('admin', 'manager', 'member'), addItemToOrder);

router.post('/:id/checkout', authorizeRoles('admin', 'manager'), checkoutOrder);

router.post('/:id/cancel', authorizeRoles('admin', 'manager'), cancelOrder);

module.exports = router;
