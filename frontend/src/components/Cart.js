import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas, Button, ListGroup, Form } from 'react-bootstrap';
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

    const handleCheckout = () => {
        onHide();
        if (user) {
            navigate('/checkout');
        } else {
            navigate('/checkout-choice');
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Vider tout le panier ?')) {
            clearCart();
            toast.success('Panier vidé', { duration: 1500 });
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>🛒 Mon Panier ({cartItems.length})</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Votre panier est vide</p>
                        <Button variant="primary" onClick={onHide} className="mt-2">
                            Continuer mes achats
                        </Button>
                    </div>
                ) : (
                    <>
                        <ListGroup variant="flush">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item._id} className="cart-item">
                                    <div className="d-flex gap-3 align-items-center">
                                        <img 
                                            src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://via.placeholder.com/60'} 
                                            alt={item.name}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}
                                        />
                                        <div className="flex-grow-1">
                                            <div className="product-name">{item.name}</div>
                                            <div className="product-price">{item.price} DT</div>
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max={item.stock}
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 0, item.name)}
                                                    className="cart-quantity-input"
                                                    style={{ width: '70px' }}
                                                />
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    className="cart-remove-btn"
                                                    onClick={() => {
                                                        removeFromCart(item._id);
                                                        toast.error(`${item.name} retiré`, { duration: 1500 });
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        
                        <div className="cart-total">
                            <div className="d-flex justify-content-between">
                                <span className="cart-total-label">Total</span>
                                <span className="cart-total-amount">{cartTotal.toFixed(2)} DT</span>
                            </div>
                        </div>
                        
                        <Button 
                            variant="success" 
                            className="cart-checkout-btn w-100"
                            onClick={handleCheckout}
                        >
                            Procéder au paiement →
                        </Button>
                        
                        <Button 
                            variant="warning" 
                            className="cart-clear-btn w-100"
                            onClick={handleClearCart}
                        >
                            🗑️ Vider le panier
                        </Button>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Cart;
