import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const regions = [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
        'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
        'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
        'Sfax', 'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
    ];

    const [shipping, setShipping] = useState({
        fullName: user?.name || '',
        phone: '',
        phone2: '',
        address: '',
        region: '',
        comment: ''
    });

    // Rediriger si non connecté
    useEffect(() => {
        if (!user) {
            toast.error('Veuillez vous connecter');
            navigate('/login');
        }
    }, [user, navigate]);

    // Rediriger si panier vide
    useEffect(() => {
        if (cartItems.length === 0 && user) {
            navigate('/products');
        }
    }, [cartItems.length, navigate, user]);

    // Mettre à jour le nom quand user change
    useEffect(() => {
        if (user) {
            setShipping(prev => ({ ...prev, fullName: user.name }));
        }
    }, [user]);

    if (!user) {
        return <div className="text-center mt-5">Redirection...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!shipping.region) {
            setError('Veuillez sélectionner une région');
            return;
        }
        
        setLoading(true);

        const orderData = {
            items: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            })),
            shippingAddress: {
                fullName: shipping.fullName,
                phone: shipping.phone,
                phone2: shipping.phone2,
                address: shipping.address,
                region: shipping.region,
                comment: shipping.comment,
                country: 'Tunisie'
            }
        };

        try {
            const response = await createOrder(orderData);
            clearCart();
            toast.success('Commande validée !');
            setTimeout(() => {
                navigate('/order-confirmation', { state: { order: response } });
            }, 100);
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.response?.data?.message || 'Erreur lors de la commande');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4 mb-5">
            <h2 className="mb-4">Finaliser votre commande</h2>
            <p className="text-muted mb-4">Bonjour {user?.name}, veuillez confirmer vos informations</p>
            
            <Row>
                <Col md={7}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="mb-3">Adresse de livraison</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom complet <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        value={shipping.fullName}
                                        onChange={(e) => setShipping({...shipping, fullName: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Téléphone <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={shipping.phone}
                                                onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Téléphone 2 (facultatif)</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={shipping.phone2}
                                                onChange={(e) => setShipping({...shipping, phone2: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Adresse complète <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={shipping.address}
                                        onChange={(e) => setShipping({...shipping, address: e.target.value})}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Région <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={shipping.region}
                                        onChange={(e) => setShipping({...shipping, region: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionnez votre région</option>
                                        {regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Commentaire (facultatif)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={shipping.comment}
                                        onChange={(e) => setShipping({...shipping, comment: e.target.value})}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="success" className="w-100" disabled={loading}>
                                    {loading ? 'Commande en cours...' : `Confirmer la commande (${cartTotal.toFixed(2)} DT)`}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="mb-3">Récapitulatif</Card.Title>
                            <ListGroup variant="flush">
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item._id} className="d-flex align-items-center px-0">
                                        <img 
                                            src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/50'} 
                                            alt={item.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                        />
                                        <div className="flex-grow-1">
                                            <div><strong>{item.name}</strong></div>
                                            <div className="text-muted small">Quantité: {item.quantity}</div>
                                        </div>
                                        <div className="text-primary fw-bold">
                                            {(item.price * item.quantity).toFixed(2)} DT
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <strong>Total</strong>
                                <strong className="text-success fs-5">{cartTotal.toFixed(2)} DT</strong>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    <div className="text-center mt-3">
                        <Button variant="link" onClick={() => navigate('/checkout-guest')}>
                            Commander sans compte ?
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;
