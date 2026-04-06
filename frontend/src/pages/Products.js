import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { getProducts } from '../services/productService';
import { CartContext } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useContext(CartContext);

    const categories = ['Tous', 'Jeux', 'Figurine', 'Pièce de collection'];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'Tous') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (productId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} ajouté !`, {
            duration: 2000,
            position: 'bottom-right',
            icon: '🛒',
            style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '10px',
            },
        });
        setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );

    return (
        <Container className="mt-4 mb-5">
            <h2 className="text-center mb-4" style={{ fontWeight: '700' }}>
                Nos Produits
            </h2>
            
            <div className="mb-5 text-center">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`category-filter ${selectedCategory === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <Row>
                {filteredProducts.map(product => (
                    <Col md={6} lg={4} xl={3} className="mb-4" key={product._id}>
                        <div className="product-card">
                            <div className="product-image-container">
                                <img 
                                    src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1fdf?w=300'} 
                                    alt={product.name}
                                    className="product-image"
                                />
                                <span className="product-category">{product.category}</span>
                            </div>
                            <div className="product-body">
                                <h3 className="product-title">{product.name}</h3>
                                <p className="product-description">{product.description?.substring(0, 80)}...</p>
                                <div className="product-price">{product.price}</div>
                                <div className="product-stock">
                                    {product.stock > 0 ? `📦 Stock: ${product.stock}` : '❌ Rupture de stock'}
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <div className="quantity-control">
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{quantities[product._id] || 1}</span>
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(product, quantities[product._id] || 1)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            
            {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-secondary">Aucun produit dans cette catégorie</p>
                </div>
            )}
        </Container>
    );
};

export default Products;
