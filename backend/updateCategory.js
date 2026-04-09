// Script temporaire pour renommer la catégorie "Jeux" en "Jeux vidéos"
require('dotenv').config();
const mongoose = require('mongoose');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à MongoDB');

        const result = await mongoose.connection.db.collection('products').updateMany(
            { category: "Jeux" },
            { $set: { category: "Jeux vidéos" } }
        );

        console.log(`✅ ${result.modifiedCount} produit(s) mis à jour : "Jeux" → "Jeux vidéos"`);

        const count = await mongoose.connection.db.collection('products').countDocuments({ category: "Jeux vidéos" });
        console.log(`📦 Total produits avec catégorie "Jeux vidéos" : ${count}`);

        await mongoose.disconnect();
        console.log('🔌 Déconnecté de MongoDB');
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

run();
