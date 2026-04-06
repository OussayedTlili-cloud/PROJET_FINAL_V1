import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Row, Col } from 'react-bootstrap';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (location.state?.order) {
            setOrder(location.state.order);
        } else {
            const savedOrder = sessionStorage.getItem('lastOrder');
            if (savedOrder) {
                setOrder(JSON.parse(savedOrder));
            } else {
                navigate('/products');
            }
        }
    }, [location, navigate]);

    useEffect(() => {
        if (order) {
            sessionStorage.setItem('lastOrder', JSON.stringify(order));
        }
    }, [order]);

    if (!order) {
        return (
            <Container className="text-center mt-5">
                <h3 style={{ color: '#ffffff' }}>Chargement de votre commande...</h3>
                <Button onClick={() => navigate('/products')} className="mt-3">
                    Retour aux produits
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Card className="text-center p-4 shadow-lg border-0" style={{ borderRadius: '20px', background: '#1a1a1a' }}>
                <div className="mb-3">
                    <div 
                        style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#22c55e', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}
                    >
                        <span style={{ fontSize: '50px', color: 'white' }}>✓</span>
                    </div>
                </div>
                
                <h1 className="text-success" style={{ fontSize: '2rem' }}>Commande validée avec succès !</h1>
                <p className="lead mt-3" style={{ color: '#ffffff' }}>Merci de nous avoir fait confiance</p>
                <p style={{ color: '#ffffff', marginBottom: '1.5rem' }}>Votre commande est en cours de livraison</p>
                
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6} className="mx-auto">
                            <Card style={{ background: '#2a2a2a', border: 'none', borderRadius: '15px' }}>
                                <Card.Body>
                                    <h5 className="text-muted">Numéro de commande</h5>
                                    <h3 className="text-primary fw-bold">{order.orderNumber || order._id?.slice(-8)}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="text-start">
                        <Col md={6}>
                            <h5 className="mb-3" style={{ color: '#ffffff' }}>📦 Informations de livraison</h5>
                            <p style={{ color: '#ffffff' }}><strong style={{ color: '#a3a3a3' }}>{order.shippingAddress?.fullName || 'Non renseigné'}</strong></p>
                            <p style={{ color: '#ffffff' }}>📞 {order.shippingAddress?.phone || '-'}</p>
                            {order.shippingAddress?.phone2 && <p style={{ color: '#ffffff' }}>📞 Tél 2: {order.shippingAddress?.phone2}</p>}
                            <p style={{ color: '#ffffff' }}>📍 {order.shippingAddress?.address || '-'}</p>
                            <p style={{ color: '#ffffff' }}>🏙️ {order.shippingAddress?.region || '-'}, {order.shippingAddress?.country || 'Tunisie'}</p>
                        </Col>
                        <Col md={6}>
                            <h5 className="mb-3" style={{ color: '#ffffff' }}>📋 Détails de la commande</h5>
                            <p style={{ color: '#ffffff' }}><strong style={{ color: '#a3a3a3' }}>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p style={{ color: '#ffffff' }}><strong style={{ color: '#a3a3a3' }}>Statut:</strong> <span className="text-warning">{order.status || 'en attente'}</span></p>
                            <p style={{ color: '#ffffff' }}><strong style={{ color: '#a3a3a3' }}>Mode:</strong> {order.user ? 'Compte connecté' : 'Commande invité'}</p>
                        </Col>
                    </Row>

                    {order.shippingAddress?.comment && (
                        <div className="text-start mt-3">
                            <h5 className="mb-2" style={{ color: '#ffffff' }}>💬 Votre commentaire</h5>
                            <p style={{ background: '#2a2a2a', padding: '15px', borderRadius: '10px', color: '#ffffff' }}>
                                {order.shippingAddress.comment}
                            </p>
                        </div>
                    )}

                    <h5 className="text-start mt-4" style={{ color: '#ffffff' }}>🛍️ Vos articles</h5>
                    <ListGroup className="mb-3" style={{ background: 'transparent' }}>
                        {order.items?.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between" style={{ background: '#2a2a2a', color: '#ffffff', borderColor: '#3a3a3a' }}>
                                <span>{item.name} x {item.quantity}</span>
                                <span className="fw-bold">{(item.price * item.quantity).toFixed(2)} DT</span>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item className="d-flex justify-content-between fw-bold" style={{ background: '#2a2a2a', color: '#ffffff', borderColor: '#3a3a3a' }}>
                            <span>Total</span>
                            <span className="text-success fs-5">{order.totalAmount?.toFixed(2)} DT</span>
                        </ListGroup.Item>
                    </ListGroup>

                    <div className="mt-4 d-flex gap-3 justify-content-center">
                        <Button variant="outline-primary" onClick={() => navigate('/products')}>
                            Continuer mes achats
                        </Button>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Retour à l'accueil
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrderConfirmation;
