const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
require('dotenv').config();

const viewOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB\n');
        
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        console.log(`📦 Total des commandes: ${orders.length}\n`);
        
        orders.forEach((order, index) => {
            console.log(`=== Commande ${index + 1} ===`);
            console.log(`Numéro: ${order.orderNumber || 'N/A'}`);
            console.log(`Client: ${order.user ? order.user.name : order.guestInfo?.name || 'Invité'}`);
            console.log(`Email: ${order.user ? order.user.email : order.guestInfo?.email || 'Non renseigné'}`);
            console.log(`Total: ${order.totalAmount} DT`);
            console.log(`Statut: ${order.status}`);
            console.log(`Date: ${new Date(order.createdAt).toLocaleString()}`);
            console.log('-------------------\n');
        });
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

viewOrders();
