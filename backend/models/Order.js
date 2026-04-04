const mongoose = require('mongoose');

// Générer un numéro de commande unique
async function generateOrderNumber() {
    const count = await mongoose.model('Order').countDocuments();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CMD-${year}-${random}`;
}

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    guestInfo: {
        email: { type: String, default: '' },
        name: { type: String, default: '' }
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
        phone: { type: String, required: true },
        phone2: { type: String, default: '' },
        address: { type: String, required: true },
        region: { type: String, required: true },
        comment: { type: String, default: '' },
        country: { type: String, required: true, default: 'Tunisie' }
    },
    orderNumber: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
