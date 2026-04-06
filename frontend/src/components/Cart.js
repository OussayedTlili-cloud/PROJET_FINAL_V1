import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas, Button, ListGroup, Form, Row, Col } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Cart = ({ show, onHide }) => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleQuantityChange = (productId, quantity, productName) => {
        if (quantity === 0) {
            removeFromCart(productId);
            toast.error(`${productName} retiré du panier`, { duration: 1500 });
        } else {
            updateQuantity(productId, quantity);
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
            clearCart();
            toast.success('Panier vidé');
        }
    };

    const handleCheckout = () => {
        onHide();
        if (user) {
            navigate('/checkout');
        } else {
            navigate('/checkout-choice');
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="shadow-lg">
            <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title className="fw-bold">
                    🛒 Mon Panier <span className="text-muted small ml-2">({cartItems.length})</span>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
                {cartItems.length === 0 ? (
                    <div className="text-center my-auto py-5">
                        <div className="fs-1 mb-3">🧺</div>
                        <h5>Votre panier est vide</h5>
                        <p className="text-muted">Découvrez nos produits et commencez vos achats !</p>
                        <Button variant="outline-primary" className="rounded-pill px-4 mt-3" onClick={onHide}>
                            Retour à la boutique
                        </Button>
                    </div>
                ) : (
                    <>
                        <ListGroup variant="flush" className="flex-grow-1 overflow-auto pe-2">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item._id} className="py-3 border-bottom border-light">
                                    <Row className="align-items-center g-0">
                                        <Col xs={3}>
                                            <img 
                                                src={item.imageUrl || 'https://via.placeholder.com/60'} 
                                                alt={item.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }}
                                                className="shadow-sm"
                                            />
                                        </Col>
                                        <Col xs={6} className="ps-2">
                                            <div className="fw-bold text-truncate small" title={item.name}>{item.name}</div>
                                            <div className="text-primary small fw-bold">{(item.price * item.quantity).toFixed(2)} DT</div>
                                            <div className="d-flex align-items-center mt-2">
                                                <Button 
                                                    variant="light" 
                                                    size="sm" 
                                                    className="p-0 border rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '22px', height: '22px' }}
                                                    onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.name)}
                                                >-</Button>
                                                <span className="mx-2 small fw-bold">{item.quantity}</span>
                                                <Button 
                                                    variant="light" 
                                                    size="sm" 
                                                    className="p-0 border rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '22px', height: '22px' }}
                                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.name)}
                                                >+</Button>
                                            </div>
                                        </Col>
                                        <Col xs={3} className="text-end">
                                            <Button 
                                                variant="link" 
                                                className="text-danger p-0"
                                                onClick={() => {
                                                    removeFromCart(item._id);
                                                    toast.error(`${item.name} retiré`, { duration: 1500 });
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        
                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex justify-content-between h5 mb-3 fw-bold">
                                <span>Total</span>
                                <span className="text-primary">{cartTotal.toFixed(2)} DT</span>
                            </div>
                            <Button 
                                variant="success" 
                                className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-2" 
                                onClick={handleCheckout}
                            >
                                {user ? 'Procéder au paiement' : 'Commander →'}
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="w-100 border-0 text-muted" 
                                onClick={handleClearCart}
                            >
                                <i className="bi bi-trash-fill small"></i> Vider le panier
                            </Button>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Cart;
