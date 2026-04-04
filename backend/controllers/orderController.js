const Order = require('../models/Order');
const Product = require('../models/Product');

// Passer une commande (user connecté)
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'La commande doit contenir au moins un produit' });
        }
        
        let totalAmount = 0;
        const orderItems = [];
        
        // Vérifier les produits et calculer le total
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Produit ${item.product} non trouvé` });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
            }
            
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
            
            totalAmount += product.price * item.quantity;
            
            // Réduire le stock
            product.stock -= item.quantity;
            await product.save();
        }
        
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer mes commandes (user connecté)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une commande par ID (user ou admin)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        
        // Vérifier si l'utilisateur est admin ou propriétaire
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin : Récupérer toutes les commandes
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin : Mettre à jour le statut d'une commande
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
