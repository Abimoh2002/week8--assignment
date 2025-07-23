const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });  // Enable _id for cart items so they can be identified individually

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true  // Added index for better query performance
    },
    items: [cartItemSchema]
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;  // Remove version key from output
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Virtual for total price (requires population)
cartSchema.virtual('totalPrice').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
    }, 0);
});

// ====== Instance Methods ======
cartSchema.methods = {
    // Add item to cart or increment quantity
    addItem: function(productId, quantity = 1) {
        const existingItem = this.items.find(item => 
            item.product.toString() === productId.toString()
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product: productId, quantity });
        }
        return this.save();
    },

    // Remove item completely
    removeItem: function(productId) {
        this.items = this.items.filter(item => 
            item.product.toString() !== productId.toString()
        );
        return this.save();
    },

    // Update specific item quantity
    updateQuantity: function(productId, newQuantity) {
        const item = this.items.find(item => 
            item.product.toString() === productId.toString()
        );
        if (item) {
            item.quantity = Math.max(1, newQuantity); // Ensure minimum quantity of 1
        }
        return this.save();
    },

    // Empty the cart
    clearCart: function() {
        this.items = [];
        return this.save();
    },

    // Convert cart to order
    createOrder: async function({ emptyCylinderReturned = false, deliveryType = 'ASAP', scheduledDate = null } = {}) {
        const Order = mongoose.model('Order');
        
        // Validate cart isn't empty
        if (this.items.length === 0) {
            throw new Error('Cannot create order from empty cart');
        }

        const order = new Order({
            userId: this.user,
            products: this.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                emptyCylinderReturned
            })),
            totalAmount: this.totalPrice,
            status: 'pending',
            deliveryType,
            scheduledDate
        });

        await order.save();
        await this.clearCart();
        return order;
    }
};

// Index for frequently queried fields
cartSchema.index({ user: 1, 'items.product': 1 });

module.exports = mongoose.model('Cart', cartSchema);