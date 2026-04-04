const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du produit est requis'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Le prix est requis'],
        min: [0, 'Le prix doit être positif']
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    stock: {
        type: Number,
        required: [true, 'Le stock est requis'],
        min: [0, 'Le stock doit être positif'],
        default: 0
    },
    imageUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
