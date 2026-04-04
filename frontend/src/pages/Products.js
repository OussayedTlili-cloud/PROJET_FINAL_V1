import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
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

    const handleQuantityChange = (productId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

    const categories = ['Tous', 'Accessoires', 'Consoles', 'Jeux'];

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

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} ajouté au panier !`, {
            duration: 2000,
            position: 'bottom-right',
            icon: '🛒',
            style: {
                background: '#28a745',
                color: '#fff',
                borderRadius: '10px',
            },
        });
        // Réinitialiser la quantité à 1
        setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    };

    if (loading) return <div className="text-center mt-5">Chargement...</div>;

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Nos Produits</h2>
            
            <div className="mb-4 text-center">
                <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ width: '200px', margin: '0 auto', display: 'inline-block' }}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </Form.Select>
            </div>

            <Row>
                {filteredProducts.map(product => (
                    <Col md={4} lg={3} className="mb-4" key={product._id}>
                        <Card className="h-100">
                            <Card.Img 
                                variant="top" 
                                src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/300'} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text className="text-muted">{product.category}</Card.Text>
                                <Card.Text>{product.description?.substring(0, 80)}...</Card.Text>
                                <Card.Text className="h5 text-primary">{product.price} DT</Card.Text>
                                <Card.Text className="small">Stock: {product.stock}</Card.Text>
                                <div className="d-flex gap-2">
                                    <div className="d-flex align-items-center border rounded">
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                            style={{ border: 'none' }}
                                        >-</Button>
                                        <span className="px-3">{quantities[product._id] || 1}</span>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                            style={{ border: 'none' }}
                                        >+</Button>
                                    </div>
                                    <Button 
                                        variant="primary" 
                                        className="flex-grow-1"
                                        onClick={() => handleAddToCart(product, quantities[product._id] || 1)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {filteredProducts.length === 0 && (
                <div className="text-center">Aucun produit dans cette catégorie</div>
            )}
        </Container>
    );
};

export default Products;
