const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address (e.g., user@example.com)']
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Never returned in queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    issuedGases: [{
        gasId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Changed from 'Gas' to match your product model
            required: true
        },
        issuedAt: {
            type: Date,
            default: Date.now
        },
        returned: {
            type: Boolean,
            default: false
        },
        returnedAt: Date
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12); // Increased salt rounds to 12
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);