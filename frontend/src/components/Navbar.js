import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import Cart from './Cart';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">E-Shop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
                            <Nav.Link as={Link} to="/products">Produits</Nav.Link>
                            {user?.role === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/admin/dashboard">Produits</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/orders">Commandes</Nav.Link>
                                </>
                            )}

                        </Nav>
                        <Nav>
                            <Button variant="outline-light" className="me-3" onClick={() => setShowCart(true)}>
                                🛒 Panier {cartCount > 0 && <Badge bg="danger">{cartCount}</Badge>}
                            </Button>
                            {user ? (
                                <>
                                    <Navbar.Text className="me-3">
                                        Bonjour, {user.name}
                                    </Navbar.Text>
                                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                        Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Cart show={showCart} onHide={() => setShowCart(false)} />
        </>
    );
};

export default NavigationBar;
