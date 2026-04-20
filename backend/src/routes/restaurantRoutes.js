const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { getRestaurants, getRestaurantMenu } = require('../controllers/restaurantController');
const {
	createRestaurant,
	deleteRestaurant,
	createMenuItem,
	deleteMenuItem
} = require('../controllers/restaurantController');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin', 'manager', 'member'));

router.get('/', getRestaurants);
router.post('/', authorizeRoles('admin', 'manager'), createRestaurant);
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteRestaurant);

router.get('/:id/menu', getRestaurantMenu);
router.post('/:restaurantId/menu-items', authorizeRoles('admin', 'manager'), createMenuItem);
router.delete('/:restaurantId/menu-items/:menuItemId', authorizeRoles('admin', 'manager'), deleteMenuItem);

module.exports = router;
