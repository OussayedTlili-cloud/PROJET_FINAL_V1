import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
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

    const handleQuantityChange = (productId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

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
            toast.error('Erreur lors de la récupération des produits');
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
        });
        setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Chargement de la collection...</p></div>;

    return (
        <Container className="mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold mb-2">Notre Collection</h1>
                <p className="text-muted lead">Découvrez nos jeux cultes, figurines et pièces de collection</p>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                    {categories.map(cat => (
                        <Button 
                            key={cat} 
                            variant={selectedCategory === cat ? "primary" : "outline-secondary"}
                            className="rounded-pill px-4 transition-all"
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <Row>
                {filteredProducts.map(product => (
                    <Col md={4} lg={3} className="mb-4" key={product._id}>
                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/300'} 
                                    style={{ height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    className="product-img"
                                />
                                <Badge 
                                    bg="dark" 
                                    className="position-absolute m-2" 
                                    style={{ top: 0, right: 0, opacity: 0.8 }}
                                >
                                    {product.category}
                                </Badge>
                            </div>
                            <Card.Body className="d-flex flex-column p-4">
                                <Card.Title className="fs-5 fw-bold mb-1 text-truncate" title={product.name}>
                                    {product.name}
                                </Card.Title>
                                <Card.Text className="text-muted small mb-3 flex-grow-1">
                                    {product.description?.substring(0, 60)}...
                                </Card.Text>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="h4 mb-0 text-primary fw-bold">{product.price.toFixed(2)} DT</div>
                                    <div className={`small ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                        {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture'}
                                    </div>
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <div className="d-flex align-items-center border rounded-pill bg-light">
                                        <Button 
                                            variant="link" 
                                            size="sm"
                                            className="text-decoration-none px-2 text-dark"
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                        >-</Button>
                                        <span className="px-1 fw-bold" style={{ minWidth: '20px', textAlign: 'center' }}>
                                            {quantities[product._id] || 1}
                                        </span>
                                        <Button 
                                            variant="link" 
                                            size="sm"
                                            className="text-decoration-none px-2 text-dark"
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                        >+</Button>
                                    </div>
                                    
                                    <Button 
                                        variant="primary" 
                                        className="flex-grow-1 rounded-pill fw-bold"
                                        onClick={() => handleAddToCart(product, quantities[product._id] || 1)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock === 0 ? 'Indisponible' : 'Ajouter'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                    <div className="fs-1 mb-3">🔍</div>
                    <h3>Aucun produit trouvé</h3>
                    <p className="text-muted">Essayez de changer de catégorie ou revenez plus tard.</p>
                </div>
            )}

            <style>
                {`
                .hover-shadow:hover {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
                    transform: translateY(-5px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .product-img:hover {
                    transform: scale(1.05);
                }
                `}
            </style>
        </Container>
    );
};

export default Products;
