const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  issueGas,
  approveProduct,
  rejectProduct
} = require('../Controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProductById);

// Admin protected routes
router.route('/')
  .post(protect, admin, createProduct);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Approve/Reject product (admin only)
router.route('/:id/approve')
  .post(protect, admin, approveProduct);
router.route('/:id/reject')
  .post(protect, admin, rejectProduct);

// User protected route for issuing gas
router.route('/:id/issue')
  .post(protect, issueGas);

  

module.exports = router;