const express = require('express');
const { registerUser, login, getMe, logout } = require('../Controllers/authController'); // Changed to registerUser
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;