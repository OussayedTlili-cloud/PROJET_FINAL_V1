import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-5">
            <Container>
                <Row>
                    <Col lg={4} md={6} className="mb-4 mb-md-0">
                        <h4 className="text-uppercase fw-bold mb-4">
                            <span className="text-primary">Retro</span>Play
                        </h4>
                        <p className="text-muted" style={{ lineHeight: '1.8' }}>
                            Votre destination ultime pour le gaming rétro et moderne en Tunisie. 
                            Passionnés par les consoles cultes, les figurines rares et les jeux inoubliables.
                        </p>
                        <div className="mt-4 d-flex gap-3">
                            <a href="#" className="text-white fs-4"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-white fs-4"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-white fs-4"><i className="bi bi-tiktok"></i></a>
                        </div>
                    </Col>

                    <Col lg={2} md={6} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase fw-bold mb-4">Navigation</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/" className="text-muted text-decoration-none hover-white transition-all">Accueil</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/products" className="text-muted text-decoration-none hover-white transition-all">Boutique</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/checkout" className="text-muted text-decoration-none hover-white transition-all">Panier</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase fw-bold mb-4">Aide</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <Link to="/faq" className="text-muted text-decoration-none hover-white transition-all">Livrason & FAQ</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/terms" className="text-muted text-decoration-none hover-white transition-all">Conditions de vente</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6}>
                        <h5 className="text-uppercase fw-bold mb-4">Contact</h5>
                        <p className="text-muted small mb-2">
                            <span className="text-primary me-2">📍</span> Grand Tunis, Tunisie
                        </p>
                        <p className="text-muted small mb-2">
                            <span className="text-primary me-2">📞</span> +216 71 000 000
                        </p>
                        <p className="text-muted small">
                            <span className="text-primary me-2">✉️</span> contact@retroplay.tn
                        </p>
                        <div className="mt-4 pt-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" width="40" className="me-2 filter-white" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width="40" className="filter-white" />
                        </div>
                    </Col>
                </Row>
                
                <hr className="my-4 border-secondary" />
                
                <Row className="align-items-center">
                    <Col md={12} className="text-center">
                        <p className="text-muted small mb-0">
                            &copy; {new Date().getFullYear()} RetroPlay Tunisia. Tous droits réservés. 
                            <br />Propulsé par la passion du jeu.
                        </p>
                    </Col>
                </Row>
            </Container>
            
            <style>
                {`
                .hover-white:hover {
                    color: white !important;
                    padding-left: 5px;
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
                .filter-white {
                    filter: brightness(0) invert(1);
                    opacity: 0.6;
                }
                `}
            </style>
        </footer>
    );
};

export default Footer;
