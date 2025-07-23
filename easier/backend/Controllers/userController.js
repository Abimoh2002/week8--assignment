const User = require('../Models/User');
const Product = require('../Models/Product');
const Order = require('../Models/Order');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new user (admin only)
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role = 'user' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: email.split('@')[0] });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if phone number already exists
        const existingPhone = await User.findOne({ phonenumber: phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Split name into firstname and lastname
        const nameParts = name.split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || firstname;

        // Create user with correct field names
        const user = await User.create({
            username: email.split('@')[0], // Use email prefix as username
            email,
            firstname,
            lastname,
            password, // Will be hashed by pre-save hook
            role,
            phonenumber: phone
        });

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            message: 'Error creating user',
            error: error.message 
        });
    }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ 
            message: 'Error updating user',
            error: error.message 
        });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            message: 'Error deleting user',
            error: error.message 
        });
    }
};

// Deactivate user (admin only)
const deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deactivated successfully', user });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ 
            message: 'Error deactivating user',
            error: error.message 
        });
    }
};

// Get user orders (protected - users can see their own)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('products.product', 'name brand price imageUrl cylinderSize')
            .sort({ createdAt: -1 });
        
        res.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders',
            error: error.message 
        });
    }
};

// Get issued gases (protected - users can see their own, admin can see any)
const getUserIssuedGases = async (req, res) => {
    try {
        const userId = req.user.role === 'admin' ? req.params.id : req.user._id;
        
        const user = await User.findById(userId)
            .select('issuedGases')
            .populate('issuedGases.gasId', 'name brand price gasType cylinderSize');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.issuedGases);
    } catch (error) {
        console.error('Error fetching issued gases:', error);
        res.status(500).json({ 
            message: 'Error fetching issued gases',
            error: error.message 
        });
    }
};

// Return gas cylinder (protected)
const returnGasCylinder = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the requesting user owns the gas or is admin
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to return this gas' });
        }

        const issuedGas = user.issuedGases.find(
            gas => gas._id.toString() === req.params.issueId && !gas.returned
        );

        if (!issuedGas) {
            return res.status(404).json({ 
                message: 'No issued gas found with that ID or already returned' 
            });
        }

        issuedGas.returned = true;
        issuedGas.returnedAt = Date.now();
        await user.save();

        // Update product stock
        const product = await Product.findById(issuedGas.gasId);
        if (product) {
            product.stockQuantity += 1;
            await product.save();
        }

        res.json({ 
            message: 'Gas cylinder returned successfully',
            issuedGas 
        });
    } catch (error) {
        console.error('Error returning gas cylinder:', error);
        res.status(500).json({ 
            message: 'Error returning gas cylinder',
            error: error.message 
        });
    }
};

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    deactivateUser,
    getUserIssuedGases,
    returnGasCylinder,
    getMyOrders
};