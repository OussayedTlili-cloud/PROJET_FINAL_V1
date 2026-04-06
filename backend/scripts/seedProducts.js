const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
    // Jeux
    { name: 'The Legend of Zelda: Tears of the Kingdom', price: 249, description: "L'aventure épique de Link dans les cieux de Hyrule. Nintendo Switch", stock: 15, category: 'Jeux', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202212/0712/7yEf4JdVthBpZFjmTp7vTtb2.jpg' },
    { name: 'God of War Ragnarök', price: 199, description: 'La fin de la saga nordique de Kratos et Atreus. PS5/PS4', stock: 12, category: 'Jeux', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi1pREJ6snaWbU9MN.png' },
    { name: 'FIFA 24', price: 179, description: 'Le jeu de football ultime avec les vraies licences', stock: 25, category: 'Jeux', imageUrl: 'https://cdn1.epicgames.com/offer/13cbc2e095b747d2aa83c56e04404e9f/EGS_FIFA24_EA_S2_1200x1600-1b7baf4c0c0e5e6d4e5e6d4e5e6d4e5e6d4e5e6d4?h=480&w=360' },
    { name: 'Call of Duty: Modern Warfare III', price: 189, description: 'Action militaire intense et multijoueur', stock: 10, category: 'Jeux', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/2114/5e5e6d4e5e6d4e5e6d4e5e6d4e5e6d4e5e6d4e5e6d4.png' },
    { name: 'Spider-Man 2', price: 239, description: 'Incarnez Peter Parker et Miles Morales dans New York', stock: 8, category: 'Jeux', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1210/4xJ8XB3bi1pREJ6snaWbU9MN.png' },
    { name: 'Elden Ring', price: 159, description: 'Le GOTY 2022, une aventure dark fantasy monumentale', stock: 20, category: 'Jeux', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/4xJ8XB3bi1pREJ6snaWbU9MN.png' },
    
    // Figurines
    { name: 'Figurine Goku Super Saiyan', price: 89, description: 'Figurine officielle Dragon Ball Z, hauteur 25cm', stock: 8, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/61xJ8XB3biL._AC_SL1500_.jpg' },
    { name: 'Figurine Naruto Sage Mode', price: 79, description: 'Naruto en mode Sage, pose dynamique, 22cm', stock: 10, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/71aF4jVthBp._AC_SL1500_.jpg' },
    { name: 'Figurine Luffy Gear 5', price: 99, description: 'One Piece - Monkey D. Luffy Gear 5, édition limitée, 26cm', stock: 5, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/61yEf4JdVthBp._AC_SL1500_.jpg' },
    { name: 'Figurine Pikachu', price: 39, description: 'Le Pokémon légendaire, 15cm, parfait pour collectionneur', stock: 20, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/51xJ8XB3biL._AC_SL1000_.jpg' },
    { name: 'Figurine Cloud Strife', price: 109, description: 'Final Fantasy VII, avec son épée Buster Sword, 28cm', stock: 4, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/61aF4jVthBp._AC_SL1500_.jpg' },
    { name: 'Figurine Iron Man Mark 85', price: 129, description: 'Marvel Avengers Endgame, armure LED, 30cm', stock: 6, category: 'Figurine', imageUrl: 'https://m.media-amazon.com/images/I/71yEf4JdVthBp._AC_SL1500_.jpg' },
    
    // Pièces de collection
    { name: 'Carte Pokémon Dracaufeu 1ère édition', price: 149, description: 'Carte holographique, état neuf, protégée sous blister', stock: 3, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/61xJ8XB3biL._AC_SL1200_.jpg' },
    { name: 'Pièce Mario 35ème Anniversaire', price: 59, description: 'Pièce collector Nintendo, boîtier de présentation', stock: 12, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/51yEf4JdVthBp._AC_SL1000_.jpg' },
    { name: 'Funko Pop! The Mandalorian (Grogu)', price: 45, description: 'Funko Pop exclusif avec The Child, 10cm', stock: 15, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/71aF4jVthBp._AC_SL1500_.jpg' },
    { name: 'Carte Yu-Gi-Oh! Dragon Blanc aux Yeux Bleus', price: 79, description: 'Première édition, légendaire, collectionneur', stock: 5, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/61xJ8XB3biL._AC_SL1200_.jpg' },
    { name: 'Medaille Sonic Adventure', price: 35, description: 'Médaille officielle Sega, édition limitée 2024', stock: 20, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/51yEf4JdVthBp._AC_SL1000_.jpg' },
    { name: 'Carte à collectionner Final Fantasy TCG', price: 69, description: 'Lot de 6 cartes rares, booster pack scellé', stock: 8, category: 'Pièce de collection', imageUrl: 'https://m.media-amazon.com/images/I/71aF4jVthBp._AC_SL1500_.jpg' }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        // Supprimer les anciens produits (optionnel)
        // await Product.deleteMany({});
        // console.log('Anciens produits supprimés');
        
        for (const product of products) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create(product);
                console.log(`✅ Ajouté: ${product.name}`);
            } else {
                console.log(`⏭️ Déjà existant: ${product.name}`);
            }
        }
        
        console.log('\n🎉 Tous les produits ont été ajoutés !');
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
}

seedProducts();
