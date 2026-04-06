import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, NavDropdown } from 'react-bootstrap';
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
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
                        <span className="text-primary">Retro</span>Play
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto text-uppercase small fw-bold">
                            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
                            <Nav.Link as={Link} to="/products">Boutique</Nav.Link>
                            
                            {user?.role === 'admin' && (
                                <NavDropdown title="💎 ADMIN" id="admin-nav-dropdown" className="bg-warning rounded px-2">
                                    <NavDropdown.Item as={Link} to="/admin/dashboard">Gestion Produits</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/admin/orders">Gestion Commandes</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                        <Nav className="align-items-center">
                            <Button 
                                variant="outline-info" 
                                className="me-lg-3 my-2 my-lg-0 d-flex align-items-center rounded-pill px-3" 
                                onClick={() => setShowCart(true)}
                            >
                                <span className="me-2">🛒</span> 
                                <span className="d-lg-none me-2">Panier</span>
                                {cartCount > 0 && <Badge bg="danger" pill>{cartCount}</Badge>}
                            </Button>
                            
                            {user ? (
                                <NavDropdown 
                                    title={<span>👤 {user.name}</span>} 
                                    id="user-nav-dropdown" 
                                    align="end"
                                    className="fw-bold"
                                >
                                    <NavDropdown.Item as={Link} to="/my-orders">
                                        📦 Mes Commandes
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                        Se déconnecter
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <div className="d-flex gap-2 ms-lg-2">
                                    <Button as={Link} to="/login" variant="link" className="text-white text-decoration-none">
                                        Connexion
                                    </Button>
                                    <Button as={Link} to="/register" variant="primary" className="rounded-pill px-4">
                                        S'inscrire
                                    </Button>
                                </div>
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
