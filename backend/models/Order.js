const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La quantité doit être au moins 1']
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Le montant total doit être positif']
    },
    status: {
        type: String,
        enum: ['en attente', 'confirmée', 'expédiée', 'livrée', 'annulée'],
        default: 'en attente'
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'France' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
