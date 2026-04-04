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
            navigate('/products');
        }
    }, [location, navigate]);

    if (!order) {
        return <div className="text-center mt-5">Chargement...</div>;
    }

    return (
        <Container className="mt-5 mb-5">
            <Card className="text-center p-4 shadow-sm">
                <div className="mb-3">
                    <div style={{ fontSize: '80px', color: '#28a745' }}>✓</div>
                    <h1 className="text-success">Commande validée !</h1>
                    <p className="lead">Merci pour votre commande</p>
                </div>
                
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6} className="mx-auto">
                            <Card className="bg-light">
                                <Card.Body>
                                    <h5>Numéro de commande</h5>
                                    <h3 className="text-primary">{order.orderNumber}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="text-start">
                        <Col md={6}>
                            <h5>Informations de livraison</h5>
                            <p>
                                <strong>{order.shippingAddress?.fullName}</strong><br />
                                Tél: {order.shippingAddress?.phone}<br />
                                {order.shippingAddress?.address}<br />
                                {order.shippingAddress?.region}, {order.shippingAddress?.country}
                            </p>
                        </Col>
                        <Col md={6}>
                            <h5>Détails de la commande</h5>
                            <p>
                                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}<br />
                                <strong>Statut:</strong> <span className="text-warning">{order.status}</span>
                            </p>
                        </Col>
                    </Row>

                    <h5 className="text-start mt-3">Articles commandés</h5>
                    <ListGroup className="mb-3">
                        {order.items?.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)} DT</span>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>{order.totalAmount?.toFixed(2)} DT</span>
                        </ListGroup.Item>
                    </ListGroup>

                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Continuer mes achats
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrderConfirmation;
