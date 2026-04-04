const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'La note doit être entre 1 et 5'],
        max: [5, 'La note doit être entre 1 et 5']
    },
    comment: {
        type: String,
        required: [true, 'Le commentaire est requis'],
        trim: true,
        maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Un utilisateur ne peut laisser qu'un seul avis par produit
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
