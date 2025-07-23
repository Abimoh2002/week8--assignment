const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        enum: ['Total', 'K-gas', 'Pro-gas', 'ola-gas', 'Other'],
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: false,
        default: null
    },
    availability: {
        type: Boolean,
        default: true
    },
    gasType: {
        type: String,
        enum: ['LPG'], // Only LPG allowed
        required: true,
        default: 'LPG',
        immutable: true
    },
    cylinderSize: {
        type: String,
        enum: ['3kg', '6kg', '12kg', '13kg', '50kg'],
        required: true
    },
    safetyFeatures: [String],
    certification: {
        type: String,
        required: true,
        default: 'EPRA Certified'
    },
    refillPrice: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    emptyCylinderExchange: {
        type: Boolean,
        default: false
    },
    lastRefillDate: {
        type: Date,
        default: Date.now
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    }
}, {
    timestamps: true
});

// Low-stock alert (log only)
productSchema.pre('save', async function(next) {
    if (
        this.isModified('stockQuantity') &&
        this.stockQuantity < 5 &&
        this.approvalStatus === 'approved'
    ) {
        // Only log if previous stock was >= 5
        const prev = await this.constructor.findById(this._id);
        if (!prev || prev.stockQuantity >= 5) {
            console.log(`Low Stock Alert: Product ${this.name} (${this.brand}, ${this.cylinderSize}) is low on stock. Only ${this.stockQuantity} left.`);
        }
    }
    next();
});

// Method to check availability
productSchema.methods.checkAvailability = function() {
    return this.availability && this.stockQuantity > 0;
};

// Method to issue gas
productSchema.methods.issueGas = async function() {
    if (!this.checkAvailability()) {
        throw new Error('Gas not available for issue');
    }
    this.stockQuantity -= 1;
    this.emptyCylinderExchange = true;
    return this.save();
};

module.exports = mongoose.model('Product', productSchema);