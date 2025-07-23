const { generateToken } = require('../middleware/auth');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phonenumber: phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate email format with more detailed error message
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = email.trim();
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ message: 'Please enter a valid email address (e.g., user@example.com)' });
        }

        // Split name into firstname and lastname
        const nameParts = name.trim().split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Create new user (password will be hashed by the pre-save hook)
        const user = await User.create({
            username: email, // Use email as username
            email,
            password: password, // Will be hashed by pre-save hook
            firstname,
            lastname,
            address: 'Nairobi, Kenya', // Default address
            role: role || 'user',
            phonenumber: phone
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: `${user.firstname} ${user.lastname}`.trim(),
                role: user.role,
                phonenumber: user.phonenumber,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user',
            error: error.message 
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isActive) {
                return res.status(403).json({ message: 'Account is deactivated' });
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                name: `${user.firstname} ${user.lastname}`.trim(),
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('issuedGases.gasId', 'name brand price');
        
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        // Since we're using JWT tokens stored in localStorage, 
        // the actual logout happens on the client side
        // This endpoint can be used for server-side cleanup if needed
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, login, getMe, logout };