const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function checkProduct() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        const product = await Product.findOne({ name: "The Legend of Zelda: Tears of the Kingdom" });
        if (product) {
            console.log('Produit trouvé :');
            console.log('Nom:', product.name);
            console.log('imageUrl:', product.imageUrl);
        } else {
            console.log('Produit non trouvé');
        }
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

checkProduct();
