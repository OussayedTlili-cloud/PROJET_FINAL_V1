import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Row, Col, Alert } from 'react-bootstrap';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    const handlePrint = () => {
        window.print();
    };

    if (!order) {
        return (
            <Container className="text-center mt-5">
                <Card className="p-5 shadow-sm border-0 bg-light">
                    <h3>Oups ! Aucune commande trouvée</h3>
                    <p className="text-muted">Si vous venez de passer une commande, vos détails s'affichent ici temporairement. Vous recevrez une confirmation par email.</p>
                    <div className="mt-4">
                        <Button variant="primary" onClick={() => navigate('/products')}>
                            Retourner à la boutique
                        </Button>
                    </div>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5 printable-area">
            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    .printable-area { margin: 0; padding: 0; width: 100%; }
                    .card { border: 1px solid #ddd !important; box-shadow: none !important; }
                    body { background: white !important; }
                }
                `}
            </style>
            
            <Card className="p-4 shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <div className="text-center mb-4 no-print">
                    <div 
                        style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: '#28a745', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            animation: 'scaleIn 0.5s ease-out'
                        }}
                    >
                        <span style={{ fontSize: '50px', color: 'white' }}>✓</span>
                    </div>
                    <style>
                        {`
                        @keyframes scaleIn {
                            from { transform: scale(0); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        `}
                    </style>
                    <h1 className="text-success mt-3 fw-bold">Commande Validée !</h1>
                    <p className="lead">Merci pour votre confiance. Préparez-vous à jouer ! 🎮</p>
                </div>
                
                <Card.Body>
                    <Alert variant="info" className="text-center mb-4 shadow-sm border-0">
                        <h5 className="mb-0">Numéro de commande : <strong className="text-primary">{order.orderNumber}</strong></h5>
                    </Alert>

                    <Row className="mb-4 text-start">
                        <Col md={6}>
                            <h5 className="border-bottom pb-2 mb-3">📍 Livraison</h5>
                            <p className="mb-1"><strong>{order.shippingAddress?.fullName}</strong></p>
                            <p className="mb-1">📞 {order.shippingAddress?.phone}</p>
                            <p className="mb-1">📍 {order.shippingAddress?.address}</p>
                            <p className="mb-0">🏘️ {order.shippingAddress?.region}, Tunisie</p>
                        </Col>
                        <Col md={6} className="mt-4 mt-md-0">
                            <h5 className="border-bottom pb-2 mb-3">📋 Détails</h5>
                            <p className="mb-1"><strong>Date :</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="mb-1"><strong>Statut :</strong> <Badge bg="warning" text="dark">{order.status}</Badge></p>
                            <p className="mb-0 text-muted small">Un agent vous contactera par téléphone pour confirmer la livraison.</p>
                        </Col>
                    </Row>

                    <h5 className="text-start mt-4 mb-3">🛍️ Récapitulatif</h5>
                    <ListGroup className="mb-4 shadow-sm">
                        {order.items?.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold">{item.name}</span>
                                    <span className="text-muted small ms-2">x {item.quantity}</span>
                                </div>
                                <span className="fw-bold">{(item.price * item.quantity).toFixed(2)} DT</span>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center bg-dark text-white p-3">
                            <span className="h5 mb-0">Total Payé :</span>
                            <span className="h4 mb-0 fw-bold">{order.totalAmount?.toFixed(2)} DT</span>
                        </ListGroup.Item>
                    </ListGroup>

                    <div className="mt-5 d-flex flex-column flex-md-row gap-3 justify-content-center no-print">
                        <Button variant="outline-dark" onClick={handlePrint} className="px-4 py-2">
                            🖨️ Imprimer mon reçu
                        </Button>
                        <Button variant="primary" onClick={() => navigate('/products')} className="px-5 py-2 fw-bold">
                            Continuer mes achats
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

// Injection du composant Badge qui manquait dans l'import
const Badge = (props) => <span className={`badge bg-${props.bg} text-${props.text || 'white'}`}>{props.children}</span>;

export default OrderConfirmation;
