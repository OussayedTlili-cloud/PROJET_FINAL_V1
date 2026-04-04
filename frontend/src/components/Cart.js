import React, { useContext } from 'react';
import { Offcanvas, Button, ListGroup, Form } from 'react-bootstrap';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = ({ show, onHide }) => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleCheckout = (path) => {
        onHide();
        navigate(path);
    };

    const handleRemove = (productId, productName) => {
        removeFromCart(productId);
        toast.error(`${productName} retiré du panier`, {
            duration: 1500,
            position: 'bottom-right',
        });
    };

    const handleQuantityChange = (productId, quantity, productName) => {
        updateQuantity(productId, quantity);
        if (quantity === 0) {
            toast.error(`${productName} retiré du panier`, {
                duration: 1500,
                position: 'bottom-right',
            });
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Mon Panier ({cartItems.length} articles)</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <p className="text-center">Votre panier est vide</p>
                ) : (
                    <>
                        <ListGroup variant="flush">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                                    <div className="me-3" style={{ width: '60px' }}>
                                        <img 
                                            src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/60'} 
                                            alt={item.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div><strong>{item.name}</strong></div>
                                        <div className="text-muted small">{item.price} DT</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={item.stock}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value), item.name)}
                                            style={{ width: '60px', marginRight: '10px' }}
                                        />
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleRemove(item._id, item.name)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="mt-3">
                            <h5>Total: {cartTotal.toFixed(2)} DT</h5>
                            <Button variant="success" className="w-100 mt-2" onClick={() => handleCheckout('/checkout')}>
                                Commander (Se connecter)
                            </Button>
                            <Button variant="outline-success" className="w-100 mt-2" onClick={() => handleCheckout('/checkout-guest')}>
                                Commander sans compte
                            </Button>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Cart;
