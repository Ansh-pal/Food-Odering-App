const mongoose = require('mongoose');

const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { isCountryAllowed } = require('../middleware/countryScopeGuard');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const canAccessOrder = (user, order) => {
  if (user.role === 'admin' || user.role === 'manager') {
    return true;
  }

  return String(order.createdBy) === String(user.id);
};

const recalculateTotals = (items) => {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
};

const createOrder = async (req, res, next) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId || !isValidObjectId(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid restaurantId is required'
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!isCountryAllowed(req.user, restaurant.country)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    const order = await Order.create({
      createdBy: req.user.id,
      country: restaurant.country,
      restaurantId: restaurant._id,
      items: [],
      totalAmount: 0,
      status: 'draft'
    });

    return res.status(201).json({
      success: true,
      message: 'Draft order created',
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

const addItemToOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { menuItemId, quantity } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    if (!menuItemId || !isValidObjectId(menuItemId)) {
      return res.status(400).json({ success: false, message: 'Valid menuItemId is required' });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be an integer greater than 0' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    if (order.status !== 'draft') {
      return res.status(409).json({
        success: false,
        message: 'Only draft orders can be modified'
      });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    if (menuItem.restaurantId.toString() !== order.restaurantId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Menu item does not belong to this order restaurant'
      });
    }

    order.items.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      quantity: parsedQuantity,
      unitPrice: menuItem.price,
      lineTotal: menuItem.price * parsedQuantity
    });
    order.totalAmount = recalculateTotals(order.items);

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Item added to order',
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

const checkoutOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    if (order.status !== 'draft') {
      return res.status(409).json({
        success: false,
        message: 'Only draft orders can be checked out'
      });
    }

    if (!order.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cannot checkout an empty order'
      });
    }

    const user = await User.findById(order.createdBy);
    if (!user || !user.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method not available for order owner'
      });
    }

    order.status = 'placed';
    order.paymentSnapshot = {
      type: user.paymentMethod.type,
      provider: user.paymentMethod.provider,
      last4: user.paymentMethod.last4
    };

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(409).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (order.status !== 'placed') {
      return res.status(409).json({
        success: false,
        message: 'Only placed orders can be cancelled'
      });
    }

    order.status = 'cancelled';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'member') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'admin' && req.query.country) {
      query.country = req.query.country;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name username role country')
      .populate('restaurantId', 'name country cuisine');

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id)
      .populate('createdBy', 'name username role country')
      .populate('restaurantId', 'name country cuisine');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  addItemToOrder,
  checkoutOrder,
  cancelOrder,
  getOrders,
  getOrderById
};
