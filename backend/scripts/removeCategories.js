const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

async function removeCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        const result = await Product.deleteMany({ 
            category: { $in: ['Accessoires', 'Consoles'] } 
        });
        
        console.log(`✅ ${result.deletedCount} produits supprimés (Accessoires & Consoles)`);
        
        // Voir les catégories restantes
        const categories = await Product.distinct('category');
        console.log('📁 Catégories restantes:', categories);
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

removeCategories();
