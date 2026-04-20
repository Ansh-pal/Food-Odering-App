const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const users = [
  {
    name: 'Nick Fury',
    username: 'nick.fury',
    password: 'Pass@123',
    role: 'admin',
    country: 'America',
    paymentMethod: { type: 'card', provider: 'Mastercard', last4: '1111' }
  },
  {
    name: 'Captain Marvel',
    username: 'captain.marvel',
    password: 'Pass@123',
    role: 'manager',
    country: 'India',
    paymentMethod: { type: 'upi', provider: 'GPay', last4: '2222' }
  },
  {
    name: 'Captain America',
    username: 'captain.america',
    password: 'Pass@123',
    role: 'manager',
    country: 'America',
    paymentMethod: { type: 'card', provider: 'Visa', last4: '3333' }
  },
  {
    name: 'Thanos',
    username: 'thanos',
    password: 'Pass@123',
    role: 'member',
    country: 'India',
    paymentMethod: { type: 'wallet', provider: 'Paytm', last4: '4444' }
  },
  {
    name: 'Thor',
    username: 'thor',
    password: 'Pass@123',
    role: 'member',
    country: 'India',
    paymentMethod: { type: 'upi', provider: 'PhonePe', last4: '5555' }
  },
  {
    name: 'Travis',
    username: 'travis',
    password: 'Pass@123',
    role: 'member',
    country: 'America',
    paymentMethod: { type: 'card', provider: 'Amex', last4: '6666' }
  }
];

const restaurants = [
  { name: 'Spice Route', country: 'India', cuisine: 'North Indian' },
  { name: 'Mumbai Bites', country: 'India', cuisine: 'Street Food' },
  { name: 'Liberty Grill', country: 'America', cuisine: 'American' },
  { name: 'Brooklyn Pizza', country: 'America', cuisine: 'Italian-American' }
];

const menuCatalog = {
  'Spice Route': [
    { name: 'Paneer Tikka', description: 'Char-grilled cottage cheese cubes', price: 260 },
    { name: 'Dal Makhani', description: 'Slow-cooked black lentils in cream', price: 220 },
    { name: 'Butter Naan', description: 'Leavened flatbread with butter', price: 60 },
    { name: 'Chicken Biryani', description: 'Aromatic rice with spiced chicken', price: 320 }
  ],
  'Mumbai Bites': [
    { name: 'Vada Pav', description: 'Mumbai style potato slider', price: 80 },
    { name: 'Pav Bhaji', description: 'Spiced mashed vegetables and bread', price: 180 },
    { name: 'Masala Dosa', description: 'Crispy crepe with potato filling', price: 190 },
    { name: 'Chole Kulche', description: 'Chickpea curry with kulcha bread', price: 200 }
  ],
  'Liberty Grill': [
    { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar and fries', price: 14 },
    { name: 'Grilled Chicken Salad', description: 'Greens with grilled chicken breast', price: 12 },
    { name: 'Buffalo Wings', description: 'Spicy wings with ranch dip', price: 11 },
    { name: 'Mac and Cheese', description: 'Creamy baked macaroni', price: 10 }
  ],
  'Brooklyn Pizza': [
    { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 16 },
    { name: 'Pepperoni Pizza', description: 'Loaded pepperoni and cheese', price: 18 },
    { name: 'Garlic Knots', description: 'Oven baked garlic bread knots', price: 7 },
    { name: 'Caesar Salad', description: 'Romaine, croutons, parmesan', price: 9 }
  ]
};

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({})
    ]);

    const insertedUsers = await User.insertMany(users);
    const insertedRestaurants = await Restaurant.insertMany(restaurants);

    const menuItems = insertedRestaurants.flatMap((restaurant) => {
      const baseItems = menuCatalog[restaurant.name] || [];
      return baseItems.map((item) => ({
        ...item,
        restaurantId: restaurant._id,
        isAvailable: true
      }));
    });

    const insertedMenuItems = await MenuItem.insertMany(menuItems);

    // eslint-disable-next-line no-console
    console.log('Seed complete');
    // eslint-disable-next-line no-console
    console.log(`Users: ${insertedUsers.length}`);
    // eslint-disable-next-line no-console
    console.log(`Restaurants: ${insertedRestaurants.length}`);
    // eslint-disable-next-line no-console
    console.log(`Menu items: ${insertedMenuItems.length}`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
