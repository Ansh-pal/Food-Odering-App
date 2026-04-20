const mongoose = require('mongoose');

const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { isCountryAllowed } = require('../middleware/countryScopeGuard');

const canManageRestaurant = (user, restaurantCountry) => {
  if (user.role === 'admin') {
    return true;
  }

  return user.role === 'manager' && user.country === restaurantCountry;
};

const canManageCountry = (user, country) => {
  if (user.role === 'admin') {
    return true;
  }

  return user.role === 'manager' && user.country === country;
};

const getRestaurants = async (req, res, next) => {
  try {
    const includeMenu = String(req.query.includeMenu || 'false').toLowerCase() === 'true';
    const query = { isActive: true };

    if (req.user.role !== 'admin') {
      query.country = req.user.country;
    } else if (req.query.country) {
      query.country = req.query.country;
    }

    const restaurants = await Restaurant.find(query).sort({ name: 1 });

    if (!includeMenu) {
      return res.status(200).json({
        success: true,
        data: restaurants
      });
    }

    const restaurantIds = restaurants.map((restaurant) => restaurant._id);
    const menuItems = await MenuItem.find({
      restaurantId: { $in: restaurantIds },
      isAvailable: true
    }).sort({ name: 1 });

    const menuMap = menuItems.reduce((acc, item) => {
      const key = item.restaurantId.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const data = restaurants.map((restaurant) => ({
      ...restaurant.toObject(),
      menu: menuMap[restaurant._id.toString()] || []
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return next(error);
  }
};

const getRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant id'
      });
    }

    const restaurant = await Restaurant.findById(id);

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

    const menu = await MenuItem.find({
      restaurantId: restaurant._id,
      isAvailable: true
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: {
        restaurant,
        menu
      }
    });
  } catch (error) {
    return next(error);
  }
};

const createRestaurant = async (req, res, next) => {
  try {
    const { name, country, cuisine } = req.body;

    if (!name || !country || !cuisine) {
      return res.status(400).json({
        success: false,
        message: 'name, country, and cuisine are required'
      });
    }

    const normalizedCountry = String(country).trim();

    if (!['India', 'America'].includes(normalizedCountry)) {
      return res.status(400).json({
        success: false,
        message: 'country must be either India or America'
      });
    }

    if (!canManageCountry(req.user, normalizedCountry)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    const restaurant = await Restaurant.create({
      name: String(name).trim(),
      country: normalizedCountry,
      cuisine: String(cuisine).trim(),
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    return next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant id'
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!canManageRestaurant(req.user, restaurant.country)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    await MenuItem.deleteMany({ restaurantId: restaurant._id });
    restaurant.isActive = false;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully',
      data: restaurant
    });
  } catch (error) {
    return next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant id'
      });
    }

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name and price are required'
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!canManageRestaurant(req.user, restaurant.country)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'price must be a valid number greater than or equal to 0'
      });
    }

    const menuItem = await MenuItem.create({
      restaurantId: restaurant._id,
      name: String(name).trim(),
      description: String(description || '').trim(),
      price: parsedPrice,
      isAvailable: true
    });

    return res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    return next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { restaurantId, menuItemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant or menu item id'
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!canManageRestaurant(req.user, restaurant.country)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    const menuItem = await MenuItem.findOne({
      _id: menuItemId,
      restaurantId: restaurant._id
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await MenuItem.deleteOne({ _id: menuItem._id });

    return res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: menuItem
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantMenu,
  createRestaurant,
  deleteRestaurant,
  createMenuItem,
  deleteMenuItem
};
