import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

const CheckoutChoice = () => {
    const { cartItems } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/checkout');
        }
        if (cartItems.length === 0) {
            navigate('/products');
        }
    }, [user, cartItems, navigate]);

    return (
        <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
            <div className="w-100" style={{ maxWidth: '900px' }}>
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5">Finaliser votre commande</h1>
                    <p className="text-muted lead">Choisissez comment vous souhaitez procéder</p>
                </div>
                
                <Row className="g-4">
                    <Col md={6}>
                        <Card 
                            className="h-100 border-0 shadow-sm hover-shadow transition-all text-center p-4" 
                            style={{ borderRadius: '24px', cursor: 'pointer' }}
                            onClick={() => navigate('/checkout-guest')}
                        >
                            <Card.Body className="d-flex flex-column align-items-center">
                                <div className="bg-light rounded-circle p-4 mb-4 text-success shadow-inner">
                                    <i className="bi bi-person-fill fs-1"></i>
                                </div>
                                <h3 className="fw-bold mb-3">Commander sans compte</h3>
                                <p className="text-muted mb-4 flex-grow-1">
                                    Rapide et simple. Idéal pour une commande ponctuelle sans mémoriser vos données.
                                </p>
                                <Button variant="success" className="rounded-pill px-5 py-2 fw-bold w-100">
                                    Continuer en invité
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6}>
                        <Card 
                            className="h-100 border-0 shadow-sm hover-shadow transition-all text-center p-4 bg-dark text-white" 
                            style={{ borderRadius: '24px', cursor: 'pointer' }}
                            onClick={() => navigate('/login', { state: { fromCheckout: true } })}
                        >
                            <Card.Body className="d-flex flex-column align-items-center">
                                <div className="bg-primary rounded-circle p-4 mb-4 text-white shadow">
                                    <i className="bi bi-shield-lock-fill fs-1"></i>
                                </div>
                                <h3 className="fw-bold mb-3">Me connecter</h3>
                                <p className="text-light opacity-75 mb-4 flex-grow-1">
                                    Accédez à votre historique, profitez de vos avantages fidélité et gagnez du temps.
                                </p>
                                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold w-100 shadow-sm">
                                    Se connecter
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                <div className="mt-5 text-center">
                    <p className="text-muted">
                        Pas encore de membre ? 
                        <Button 
                            variant="link" 
                            className="fw-bold text-primary text-decoration-none" 
                            onClick={() => navigate('/register', { state: { fromCheckout: true } })}
                        >
                            Inscrivez-vous ici
                        </Button>
                    </p>
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="rounded-pill px-4 mt-3 border-0 bg-light" 
                        onClick={() => navigate('/products')}
                    >
                        ← Retourner à la boutique
                    </Button>
                </div>
            </div>

            <style>
                {`
                .hover-shadow:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
                .transition-all {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .shadow-inner {
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                }
                `}
            </style>
        </Container>
    );
};

export default CheckoutChoice;
