import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { getProducts } from '../services/productService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [loading, setLoading] = useState(true);

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

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} ajouté au panier !`);
    };

    if (loading) return <div className="text-center mt-5">Chargement...</div>;

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Nos Produits</h2>
            
            <div className="mb-4">
                <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ width: '200px', margin: '0 auto' }}
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
                                <Card.Text>{product.description.substring(0, 80)}...</Card.Text>
                                <Card.Text className="h5 text-primary">{product.price} €</Card.Text>
                                <Card.Text className="small">Stock: {product.stock}</Card.Text>
                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? 'Rupture' : 'Ajouter au panier'}
                                </Button>
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
