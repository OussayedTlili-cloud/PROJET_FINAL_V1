import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, ListGroup, Badge } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';

const CheckoutGuest = () => {
    const { cartItems, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shipping, setShipping] = useState({
        fullName: '',
        email: '',
        phone: '',
        phone2: '',
        address: '',
        region: '',
        comment: ''
    });

    const regions = [
        'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
        'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
        'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
        'Sfax', 'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
    ];

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/products');
        }
    }, [cartItems.length, navigate]);

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
            },
            guestEmail: shipping.email,
            guestName: shipping.fullName
        };

        try {
            const response = await createOrder(orderData);
            clearCart();
            toast.success('Commande validée !', { icon: '🎉' });
            setTimeout(() => {
                sessionStorage.setItem('lastOrder', JSON.stringify(response));
                navigate('/order-confirmation', { state: { order: response } });
            }, 100);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la commande');
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4 mb-5" style={{ color: '#ffffff' }}>
            <div className="mb-5 text-center">
                <h1 className="fw-bold display-5">Commande Express</h1>
                <p className="text-muted">Finalisez votre achat en quelques secondes, sans compte.</p>
            </div>
            
            <Row className="g-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                        <Card.Body>
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>1</span>
                                Vos Informations
                            </h4>
                            {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Nom Complet *</Form.Label>
                                            <Form.Control
                                                value={shipping.fullName}
                                                onChange={(e) => setShipping({...shipping, fullName: e.target.value})}
                                                required
                                                className="py-3"
                                                placeholder="Jean Dupont"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={shipping.email}
                                                onChange={(e) => setShipping({...shipping, email: e.target.value})}
                                                required
                                                className="py-3"
                                                placeholder="votre@email.com"
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
                                                className="py-3"
                                                placeholder="+216 -- --- ---"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Téléphone 2</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={shipping.phone2}
                                                onChange={(e) => setShipping({...shipping, phone2: e.target.value})}
                                                className="py-3"
                                                placeholder="(Facultatif)"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Région *</Form.Label>
                                            <Form.Select
                                                value={shipping.region}
                                                onChange={(e) => setShipping({...shipping, region: e.target.value})}
                                                required
                                                className="py-3"
                                            >
                                                <option value="">Sélectionnez votre région</option>
                                                {regions.map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <div className="h-100 d-flex align-items-end mb-3 text-muted small">
                                            📦 Pays: Tunisie
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Adresse Exacte *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={shipping.address}
                                                onChange={(e) => setShipping({...shipping, address: e.target.value})}
                                                required
                                                className="py-3"
                                                placeholder="Rue, Immeuble, Appartement..."
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-muted text-uppercase">Note pour le livreur (Facultatif)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={shipping.comment}
                                                onChange={(e) => setShipping({...shipping, comment: e.target.value})}
                                                className="py-3"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button type="submit" variant="primary" className="w-100 mt-5 py-3 rounded-pill fw-bold shadow" disabled={loading}>
                                    {loading ? 'Validation en cours...' : `Confirmer ma commande (${cartTotal.toFixed(2)} DT)`}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: '24px', top: '100px' }}>
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Récapitulatif</h4>
                            <ListGroup variant="flush" className="mb-4">
                                {cartItems.map(item => (
                                    <ListGroup.Item key={item._id} className="d-flex align-items-center px-0 bg-transparent border-light py-3">
                                        <div className="position-relative">
                                            <img 
                                                src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/60'} 
                                                alt={item.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }}
                                                className="shadow-sm"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}
                                            />
                                            <Badge pill bg="primary" className="position-absolute" style={{ top: '-10px', right: '-10px' }}>
                                                {item.quantity}
                                            </Badge>
                                        </div>
                                        <div className="ms-3 flex-grow-1">
                                            <div className="fw-bold small">{item.name}</div>
                                            <div className="text-muted small">Prix unitaire: {item.price.toFixed(2)} DT</div>
                                        </div>
                                        <div className="fw-bold text-primary">
                                            {(item.price * item.quantity).toFixed(2)} DT
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            
                            <hr className="border-light" />
                            
                            <div className="d-flex justify-content-between h4 fw-bold mt-4">
                                <span>Total à payer</span>
                                <span className="text-success">{cartTotal.toFixed(2)} DT</span>
                            </div>
                            
                            <Alert variant="warning" className="border-0 rounded-4 mt-4 small">
                                ℹ️ Paiement en espèces à la livraison. Un agent vous appellera avant le passage du livreur.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutGuest;
