const Order = require('../Models/Order');
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/User');
const mongoose = require('mongoose');

// @desc    Get all orders (Admin) or user's own orders (User)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    // Users can only see their own orders, admins see all
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }
    
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('userId', 'username email')
      .populate('products.product', 'name brand price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('products.product', 'name brand price gasType cylinderSize');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user can view this order
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user._id; // Use authenticated user

    // Validate products and check stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product || !product.availability || product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Product ${item.product} not available or insufficient stock` 
        });
      }
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.populate([
      { path: 'userId', select: 'username email' },
      { path: 'products.product', select: 'name brand price' }
    ]);
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is being processed, update product stock
    if (status === 'processing' && order.status !== 'processing') {
      for (const item of order.products) {
        const product = await Product.findById(item.product).session(session);
        if (product.stockQuantity < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ 
            message: `Insufficient stock for product ${product.name}` 
          });
        }
        product.stockQuantity -= item.quantity;
        await product.save({ session });
      }
    }

    order.status = status;
    const updatedOrder = await order.save({ session });
    await session.commitTransaction();

    await updatedOrder.populate([
      { path: 'userId', select: 'username email' },
      { path: 'products.product', select: 'name brand price' }
    ]);

    res.json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name brand price imageUrl description cylinderSize brand');

    if (!cart) {
      return res.status(200).json({ 
        items: [], 
        user: req.user._id,
        subtotal: 0,
        deliveryFee: 0,
        total: 0
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + deliveryFee;

    res.json({
      ...cart.toObject(),
      subtotal,
      deliveryFee,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    // Check product availability
    const product = await Product.findById(productId);
    if (!product || !product.availability || product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Product not available or insufficient stock' });
    }

    // Find existing cart item
    const existingCart = await Cart.findOne({ 
      user: req.user._id,
      'items.product': productId 
    });

    if (existingCart) {
      // Update quantity if item exists
      const cart = await Cart.findOneAndUpdate(
        { 
          user: req.user._id,
          'items.product': productId 
        },
        { 
          $inc: { 'items.$.quantity': quantity } 
        },
        { new: true }
      ).populate('items.product', 'name brand price imageUrl description cylinderSize brand');

      // Calculate totals
      const subtotal = cart.items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0);
      const deliveryFee = subtotal >= 5000 ? 0 : 500;
      const total = subtotal + deliveryFee;

      return res.json({
        ...cart.toObject(),
        subtotal,
        deliveryFee,
        total
      });
    }

    // Add new item if it doesn't exist
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: { items: { product: productId, quantity } },
        $setOnInsert: { user: req.user._id }
      },
      { 
        upsert: true,
        new: true,
        runValidators: true 
      }
    ).populate('items.product', 'name brand price imageUrl description cylinderSize brand');

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + deliveryFee;

    res.json({
      ...cart.toObject(),
      subtotal,
      deliveryFee,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId;

    console.log('Updating cart item:', { itemId, quantity, userId: req.user._id });

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart found:', cart._id);
    console.log('Cart items:', cart.items.map(item => ({ id: item._id, product: item.product, quantity: item.quantity })));

    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      console.log('Cart item not found for ID:', itemId);
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log('Cart item found:', { id: cartItem._id, product: cartItem.product, oldQuantity: cartItem.quantity, newQuantity: quantity });

    // Check product availability
    const product = await Product.findById(cartItem.product);
    if (!product || !product.availability || product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Product not available or insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cart.save();

    console.log('Cart item updated successfully');

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand price imageUrl description cylinderSize brand');
    
    // Calculate totals
    const subtotal = updatedCart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + deliveryFee;

    res.json({
      ...updatedCart.toObject(),
      subtotal,
      deliveryFee,
      total
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    console.log('Removing cart item:', { itemId, userId: req.user._id });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('Cart found:', cart._id);
    console.log('Cart items:', cart.items.map(item => ({ id: item._id, product: item.product, quantity: item.quantity })));

    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      console.log('Cart item not found for ID:', itemId);
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log('Cart item found for removal:', { id: cartItem._id, product: cartItem.product, quantity: cartItem.quantity });

    cartItem.remove();
    await cart.save();

    console.log('Cart item removed successfully');

    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand price imageUrl description cylinderSize brand');
    
    // Calculate totals
    const subtotal = updatedCart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + deliveryFee;

    res.json({
      ...updatedCart.toObject(),
      subtotal,
      deliveryFee,
      total
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/orders/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      ...cart.toObject(),
      subtotal: 0,
      deliveryFee: 0,
      total: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Checkout cart
// @route   POST /api/orders/cart/checkout
// @access  Private
const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { emptyCylinderReturned, deliveryType, scheduledDate } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .session(session);

    if (!cart) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot checkout empty cart' });
    }

    // Validate all items
    for (const item of cart.items) {
      if (!item.product.availability || item.product.stockQuantity < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: `Product ${item.product.name} is not available in requested quantity` 
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const totalAmount = subtotal + deliveryFee;

    // Create order
    const order = await Order.create([{
      userId: req.user._id,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryType: deliveryType || 'ASAP',
      scheduledDate: scheduledDate || null,
      emptyCylinderReturned: emptyCylinderReturned || false
    }], { session });

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );
    }

    // Clear cart
    await Cart.findByIdAndUpdate(
      cart._id,
      { $set: { items: [] } },
      { session }
    );

    await session.commitTransaction();
    
    const populatedOrder = await Order.findById(order[0]._id)
      .populate('userId', 'username email')
      .populate('products.product', 'name brand price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
  }
};

module.exports = {
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
};