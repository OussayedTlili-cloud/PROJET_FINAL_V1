const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');
        
        const adminExists = await User.findOne({ email: 'admin@ecommerce.com' });
        
        if (adminExists) {
            console.log('L\'admin existe déjà');
            process.exit();
        }
        
        const admin = await User.create({
            name: 'Admin Principal',
            email: 'admin@ecommerce.com',
            password: 'admin123456',
            role: 'admin'
        });
        
        console.log('Admin créé avec succès !');
        console.log('Email: admin@ecommerce.com');
        console.log('Mot de passe: admin123456');
        
        process.exit();
    } catch (error) {
        console.error('Erreur:', error.message);
        process.exit(1);
    }
};

createAdmin();
