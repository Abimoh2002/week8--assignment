const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
} = require('../Controllers/orderCartController');
const { protect, admin, orderOwner, cartOwner } = require('../middleware/auth');

// Order routes
router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, orderOwner, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

// Cart routes (all protected and automatically user-specific)
router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/cart/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

router.route('/cart/checkout')
  .post(protect, checkout);

module.exports = router;