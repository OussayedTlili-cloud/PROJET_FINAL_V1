const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function listCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        const products = await Product.find({}, 'name category');
        console.log('Liste des produits et catégories :');
        products.forEach(p => {
            console.log(`- ${p.name} : [${p.category}]`);
        });
        
        const jeuxCount = await Product.countDocuments({ category: 'Jeux' });
        const jeuxVideosCount = await Product.countDocuments({ category: 'Jeux vidéos' });
        
        console.log(`\nStats :`);
        console.log(`- Catégorie "Jeux" : ${jeuxCount}`);
        console.log(`- Catégorie "Jeux vidéos" : ${jeuxVideosCount}`);
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

listCategories();
