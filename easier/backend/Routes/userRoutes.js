const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  getUserIssuedGases,
  returnGasCylinder,
  getMyOrders
} = require('../Controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// User orders (for their own orders)
router.get('/orders', protect, getMyOrders);

// User management routes (admin only)
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Additional user operations
router.put('/:id/deactivate', protect, admin, deactivateUser);
router.get('/:id/issued-gases', protect, getUserIssuedGases);
router.post('/:userId/return-gas/:issueId', protect, returnGasCylinder);

module.exports = router;