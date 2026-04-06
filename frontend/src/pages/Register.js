import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        
        if (password.length < 6) {
            setError('Le mot de passe doit faire au moins 6 caractères');
            return;
        }
        
        setLoading(true);
        
        try {
            await register(name, email, password);
            const fromCheckout = location.state?.fromCheckout;
            if (fromCheckout) {
                navigate('/checkout');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur d\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Inscription</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom complet</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirmer le mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                            {loading ? 'Inscription...' : "S'inscrire"}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <Link to="/login">Déjà un compte ? Se connecter</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
