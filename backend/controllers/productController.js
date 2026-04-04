const Product = require('../models/Product');

// Ajouter un produit (admin)
const addProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category } = req.body;
        
        // Récupérer l'URL de l'image si uploadée
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        
        const product = await Product.create({
            name,
            price,
            description,
            stock,
            category,
            imageUrl
        });
        
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer tous les produits
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un produit par ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un produit (admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        const { name, price, description, stock, category } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.imageUrl;
        
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        product.imageUrl = imageUrl;
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un produit (admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        await product.deleteOne();
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
