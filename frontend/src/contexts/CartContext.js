import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Charger le panier au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        console.log('Chargement panier depuis localStorage:', savedCart);
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setCartItems(parsed);
            } catch(e) {
                console.error('Erreur parsing panier:', e);
            }
        }
    }, []);

    // Sauvegarder et mettre à jour les totaux à chaque modification
    useEffect(() => {
        console.log('Sauvegarde panier:', cartItems);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        setCartCount(count);
        setCartTotal(total);
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        console.log('Ajout au panier:', product.name, quantity);
        setCartItems(prevItems => {
            const existing = prevItems.find(item => item._id === product._id);
            if (existing) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: (item.quantity || 1) + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
