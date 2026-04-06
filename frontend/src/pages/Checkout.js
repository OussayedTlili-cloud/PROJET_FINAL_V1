import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, ListGroup, Badge } from 'react-bootstrap';
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

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        if (cartItems.length === 0 && user) {
            navigate('/products');
        }
    }, [user, cartItems.length, navigate]);

    useEffect(() => {
        if (user) {
            setShipping(prev => ({ ...prev, fullName: user.name }));
        }
    }, [user]);

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
            toast.success('Commande validée !', { icon: '🕹️' });
            setTimeout(() => {
                navigate('/order-confirmation', { state: { order: response } });
            }, 100);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la commande');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5 py-4">
            <div className="mb-5 text-center">
                <h1 className="fw-bold display-5">Finaliser ma commande</h1>
                <p className="text-muted lead">Bonjour <span className="text-primary fw-bold">{user?.name}</span>, vérifiez vos informations pour la livraison.</p>
            </div>
            
            <Row className="g-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                        <Card.Body>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>1</span>
                                Livraison
                            </h4>
                            {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Nom du destinataire *</Form.Label>
                                            <Form.Control
                                                value={shipping.fullName}
                                                onChange={(e) => setShipping({...shipping, fullName: e.target.value})}
                                                required
                                                className="bg-light border-0 py-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Téléphone *</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={shipping.phone}
                                                onChange={(e) => setShipping({...shipping, phone: e.target.value})}
                                                required
                                                className="bg-light border-0 py-3"
                                                placeholder="+216 -- --- ---"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Téléphone 2 (Optionnel)</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={shipping.phone2}
                                                onChange={(e) => setShipping({...shipping, phone2: e.target.value})}
                                                className="bg-light border-0 py-3"
                                                placeholder="Mobile ou fixe"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Région *</Form.Label>
                                            <Form.Select
                                                value={shipping.region}
                                                onChange={(e) => setShipping({...shipping, region: e.target.value})}
                                                required
                                                className="bg-light border-0 py-3"
                                            >
                                                <option value="">Sélectionnez votre région</option>
                                                {regions.map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Adresse complète *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={shipping.address}
                                                onChange={(e) => setShipping({...shipping, address: e.target.value})}
                                                required
                                                className="bg-light border-0 py-3"
                                                placeholder="Rue, N°, Ville, Code Postal..."
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Commentaire sur la commande</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={shipping.comment}
                                                onChange={(e) => setShipping({...shipping, comment: e.target.value})}
                                                className="bg-light border-0 py-3"
                                                placeholder="Ex: Appeler avant d'arriver..."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button type="submit" variant="primary" className="w-100 mt-5 py-3 rounded-pill fw-bold shadow transition-300" disabled={loading}>
                                    {loading ? 'Validation en cours...' : `Confirmer ma commande (${cartTotal.toFixed(2)} DT)`}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-4 sticky-top d-none d-lg-block" style={{ borderRadius: '24px', top: '100px' }}>
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Panier</h4>
                            <ListGroup variant="flush" className="mb-4">
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item._id} className="d-flex align-items-center px-0 bg-transparent border-light py-3">
                                        <div className="position-relative">
                                            <img 
                                                src={item.imageUrl || 'https://via.placeholder.com/60'} 
                                                alt={item.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }}
                                                className="shadow-sm border"
                                            />
                                            <Badge pill bg="primary" className="position-absolute" style={{ top: '-8px', right: '-8px' }}>
                                                {item.quantity}
                                            </Badge>
                                        </div>
                                        <div className="ms-3 flex-grow-1">
                                            <div className="fw-bold small">{item.name}</div>
                                            <div className="text-muted small">{item.price.toFixed(2)} DT</div>
                                        </div>
                                        <div className="fw-bold text-primary">
                                            {(item.price * item.quantity).toFixed(2)} DT
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            
                            <hr className="border-light" />
                            
                            <div className="d-flex justify-content-between h4 fw-bold mt-4">
                                <span>Total</span>
                                <span className="text-success">{cartTotal.toFixed(2)} DT</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;
