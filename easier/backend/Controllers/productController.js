const Product = require('../Models/Product');
const Order = require('../Models/Order');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, brand, gasType, cylinderSize } = req.query;
    
    let query = { availability: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { gasType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (brand) query.brand = brand;
    if (gasType) query.gasType = gasType;
    if (cylinderSize) query.cylinderSize = cylinderSize;
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.availability) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, brand, price, imageUrl, gasType, cylinderSize, safetyFeatures, refillPrice, description, stockQuantity } = req.body;

    const product = await Product.create({
      name,
      brand,
      price,
      imageUrl,
      gasType,
      cylinderSize,
      safetyFeatures: safetyFeatures || [],
      refillPrice,
      description,
      stockQuantity,
      approvalStatus: 'pending'
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.availability) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Always set approvalStatus to 'pending' on update
    const updateData = { ...req.body, approvalStatus: 'pending' };
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve product
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.approvalStatus = 'approved';
    await product.save();
    res.json({ message: 'Product approved', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject product
const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.approvalStatus = 'rejected';
    await product.save();
    res.json({ message: 'Product rejected', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product is currently in any active orders
    const activeOrders = await Order.countDocuments({
      'products.product': product._id,
      status: { $in: ['pending', 'processing', 'shipped'] }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({ message: 'Cannot delete product that is currently in active orders' });
    }
    
    // Soft delete
    product.availability = false;
    await product.save();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Issue gas product
// @route   POST /api/products/:id/issue
// @access  Private
const issueGas = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.availability) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.checkAvailability()) {
      return res.status(400).json({ message: 'Product out of stock or unavailable' });
    }
    
    // Use the issueGas method from the Product model
    await product.issueGas();
    
    res.json({ 
      message: 'Gas issued successfully',
      product 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  issueGas,
  approveProduct,
  rejectProduct
};