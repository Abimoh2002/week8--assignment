const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            emptyCylinderReturned: {
                type: Boolean,
                default: false
            }
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryDate: Date,
    deliveryType: {
        type: String,
        enum: ['ASAP', 'Scheduled'],
        default: 'ASAP'
    },
    scheduledDate: Date,
    // For future payment gateway integration
    // paymentDetails: {...}
}, {
    timestamps: true
});

// Add method to update product stock after order
orderSchema.methods.processOrder = async function() {
    const Product = mongoose.model('Product');
    
    for (const item of this.products) {
        const product = await Product.findById(item.product);
        if (product) {
            // Prevent order if out of stock or unavailable
            if (!product.checkAvailability()) {
                throw new Error(`Product ${product.name} is out of stock or unavailable.`);
            }
            // Use existing issueGas method from product.js
            await product.issueGas();
        }
    }
    
    this.status = 'processing';
    return this.save();
};

module.exports = mongoose.model('Order', orderSchema);