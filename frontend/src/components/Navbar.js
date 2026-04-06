import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, Form, FormControl } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import Cart from './Cart';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [showCart, setShowCart] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        🎮 RetroPlay
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
                            <Nav.Link as={Link} to="/products">Boutique</Nav.Link>
                            {user?.role === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/admin/dashboard">📦 Produits</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/orders">📋 Commandes</Nav.Link>
                                    <Nav.Link as={Link} to="/admin/stats">📊 Stats</Nav.Link>
                                </>
                            )}
                        </Nav>
                        
                        {/* Barre de recherche */}
                        <Form onSubmit={handleSearch} className="d-flex mx-auto" style={{ width: '300px' }}>
                            <FormControl
                                type="search"
                                placeholder="🔍 Rechercher un produit..."
                                className="me-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    background: '#2a2a2a',
                                    border: '1px solid #3a3a3a',
                                    color: '#fff',
                                    borderRadius: '40px'
                                }}
                            />
                            <Button type="submit" variant="outline-primary" style={{ borderRadius: '40px' }}>
                                OK
                            </Button>
                        </Form>
                        
                        <Nav>
                            <Button variant="outline-light" className="me-3" onClick={() => setShowCart(true)}>
                                🛒 {cartCount > 0 && <Badge bg="danger">{cartCount}</Badge>}
                            </Button>
                            {user ? (
                                <>
                                    <Navbar.Text className="me-3">
                                        👋 {user.name}
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
