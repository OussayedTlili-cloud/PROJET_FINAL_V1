const Review = require('../models/Review');
const Product = require('../models/Product');

// Ajouter un avis (user connecté)
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        
        // Vérifier si le produit existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        // Vérifier si l'utilisateur a déjà laissé un avis
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user.id
        });
        
        if (existingReview) {
            return res.status(400).json({ message: 'Vous avez déjà laissé un avis sur ce produit' });
        }
        
        const review = await Review.create({
            product: productId,
            user: req.user.id,
            userName: req.user.name,
            rating,
            comment
        });
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les avis d'un produit
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .sort({ createdAt: -1 });
        
        // Calculer la note moyenne
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;
        
        res.json({
            reviews,
            averageRating,
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un avis (admin ou propriétaire)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        
        // Vérifier si l'utilisateur est admin ou propriétaire
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à supprimer cet avis' });
        }
        
        await review.deleteOne();
        res.json({ message: 'Avis supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getProductReviews,
    deleteReview
};
