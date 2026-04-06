import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Row, Col } from 'react-bootstrap';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    if (!order) {
        return (
            <Container className="text-center mt-5">
                <h3>Pas de commande trouvée</h3>
                <Button onClick={() => navigate('/products')}>Retour aux produits</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Card className="text-center p-4 shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="mb-3">
                    <div 
                        style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#28a745', 
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
                <p className="lead mt-3">Merci de nous avoir fait confiance</p>
                <p className="mb-4">Votre commande est en cours de livraison</p>
                
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6} className="mx-auto">
                            <Card className="bg-light border-0" style={{ borderRadius: '15px' }}>
                                <Card.Body>
                                    <h5 className="text-muted">Numéro de commande</h5>
                                    <h3 className="text-primary fw-bold">{order.orderNumber || order._id?.slice(-8)}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="text-start">
                        <Col md={6}>
                            <h5 className="mb-3">📦 Informations de livraison</h5>
                            <p><strong>{order.shippingAddress?.fullName}</strong></p>
                            <p>📞 {order.shippingAddress?.phone}</p>
                            <p>📍 {order.shippingAddress?.address}</p>
                            <p>🏙️ {order.shippingAddress?.region}</p>
                        </Col>
                        <Col md={6}>
                            <h5 className="mb-3">📋 Détails</h5>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Statut:</strong> <span className="text-warning">{order.status}</span></p>
                        </Col>
                    </Row>

                    <h5 className="text-start mt-4">🛍️ Vos articles</h5>
                    <ListGroup className="mb-3">
                        {order.items?.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} DT</span>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item className="d-flex justify-content-between fw-bold bg-light">
                            <span>Total</span>
                            <span>{order.totalAmount?.toFixed(2)} DT</span>
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
