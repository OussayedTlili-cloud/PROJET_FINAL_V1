const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function deleteAllProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        const result = await Product.deleteMany({});
        console.log(`✅ ${result.deletedCount} produits supprimés avec succès !`);
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

deleteAllProducts();
