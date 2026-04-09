import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { 
  FaGamepad, 
  FaDragon, 
  FaGem, 
  FaTrophy, 
  FaStar, 
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight
} from 'react-icons/fa';
import { MdLocalShipping, MdVerified } from 'react-icons/md';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await getProducts();
      // Prendre les 4 premiers produits comme produits vedettes
      setFeaturedProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Catégories avec icônes
  const categories = [
    { name: 'Jeux vidéos', icon: FaGamepad, color: '#7c3aed', description: 'Les dernières sorties et classiques incontournables' },
    { name: 'Figurine', icon: FaDragon, color: '#ec4899', description: 'Personnages iconiques en édition limitée' },
    { name: 'Pièce de collection', icon: FaGem, color: '#f59e0b', description: 'Objets rares pour collectionneurs exigeants' },
  ];

  const features = [
    { icon: FaShippingFast, title: 'Livraison 48h', desc: 'Expédié depuis la Tunisie' },
    { icon: FaShieldAlt, title: 'Paiement sécurisé', desc: 'Transactions 100% protégées' },
    { icon: MdVerified, title: 'Authenticité garantie', desc: 'Produits officiels sous licence' },
    { icon: FaHeadset, title: 'Support client', desc: 'Disponible 7j/7' },
  ];

  const testimonials = [
    { name: 'Ahmed K.', rating: 5, text: 'Site incroyable ! La figurine Goku est magnifique, livraison rapide.' },
    { name: 'Sarra M.', rating: 5, text: 'Je recommande à 100% ma collection Zelda est complète grâce à eux.' },
    { name: 'Mohamed A.', rating: 5, text: 'Service client au top, ils ont répondu à toutes mes questions.' },
  ];

  return (
    <>
      {/* Hero Section avec effet parallax */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
      }}>
        {/* Effet de grille futuriste */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(124,58,237,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  background: 'rgba(124,58,237,0.2)',
                  borderRadius: '40px',
                  marginBottom: '20px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <span style={{ color: '#7c3aed', fontWeight: '600' }}>🔥 Collection 2026</span>
                </div>
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #fff 0%, #7c3aed 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '20px',
                }}>
                  L'expérience ultime du gaming
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#a3a3a3', marginBottom: '30px', lineHeight: 1.6 }}>
                  Découvrez les meilleurs jeux, figurines et pièces de collection. 
                  Des produits authentiques pour les vrais passionnés.
                </p>
                <div className="d-flex gap-3">
                  <Button 
                    onClick={() => navigate('/products')}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      border: 'none',
                      borderRadius: '40px',
                      padding: '14px 32px',
                      fontWeight: '600',
                      transition: 'transform 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Explorer la boutique <FaArrowRight style={{ marginLeft: '10px' }} />
                  </Button>
                  <Button 
                    variant="outline-light"
                    style={{ borderRadius: '40px', padding: '14px 32px', fontWeight: '600' }}
                    onClick={() => navigate('/register')}
                  >
                    Créer un compte
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  position: 'relative',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(124,58,237,0.3)',
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  padding: '40px',
                  textAlign: 'center',
                }}>
                  <FaGamepad size={120} style={{ color: 'white', opacity: 0.9 }} />
                  <h3 style={{ color: 'white', marginTop: '20px' }}>Gaming Store Tunisia</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Plus de 1000 produits disponibles</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Catégories Section */}
      <section style={{ padding: '80px 0', background: '#0f0f0f' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '15px' }}>
              Nos <span style={{ color: '#7c3aed' }}>Catégories</span>
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem' }}>Découvrez notre sélection par catégorie</p>
          </div>
          <Row>
            {categories.map((cat, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
                    borderRadius: '24px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    border: '1px solid rgba(124,58,237,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.borderColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)';
                  }}
                  onClick={() => {
                    console.log('Clic sur catégorie:', cat.name);
                    sessionStorage.setItem('selectedCategory', cat.name);
                    navigate('/products');
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${cat.color}, ${cat.color}80)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <cat.icon size={40} color="white" />
                  </div>
                  <h3 style={{ marginBottom: '10px', color: '#ffffff' }}>{cat.name}</h3>
                  <p style={{ color: '#a3a3a3' }}>{cat.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Produits Vedettes */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #0f0f0f, #0a0a0a)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '15px' }}>
              Produits <span style={{ color: '#7c3aed' }}>Vedettes</span>
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem' }}>Les articles les plus populaires du moment</p>
          </div>
          <Row>
            {!loading && featuredProducts.map((product, idx) => (
              <Col lg={3} md={6} sm={6} key={idx} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #2a2a2a',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#2a2a2a';
                  }}
                  onClick={() => navigate('/products')}
                >
                  <div style={{ 
                    height: '280px', 
                    overflow: 'hidden',
                    background: '#0f0f0f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img 
                      src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1fdf?w=400'}
                      alt={product.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.5s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h5 style={{ 
                      fontSize: '1.1rem', 
                      marginBottom: '10px', 
                      height: '50px', 
                      overflow: 'hidden',
                      fontWeight: '600',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {product.name}
                    </h5>
                    <div style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: 'bold', 
                      color: '#7c3aed', 
                      marginBottom: '15px' 
                    }}>
                      {product.price} DT
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="md" 
                      style={{ 
                        borderRadius: '40px', 
                        width: '100%',
                        padding: '10px',
                        fontWeight: '600',
                      }}
                    >
                      Voir le produit
                    </Button>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button 
              onClick={() => navigate('/products')}
              style={{
                background: 'transparent',
                border: '2px solid #7c3aed',
                borderRadius: '40px',
                padding: '12px 32px',
                color: '#7c3aed',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#7c3aed';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#7c3aed';
              }}
            >
              Voir tous les produits →
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', background: '#0f0f0f' }}>
        <Container>
          <Row>
            {features.map((feature, idx) => (
              <Col md={3} sm={6} key={idx} className="mb-4">
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'rgba(124,58,237,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px',
                  }}>
                    <feature.icon size={30} color="#7c3aed" />
                  </div>
                  <h5 style={{ marginBottom: '5px' }}>{feature.title}</h5>
                  <p style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Témoignages */}
      <section style={{ padding: '80px 0', background: '#0a0a0a' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '15px' }}>
              Ce que nos <span style={{ color: '#7c3aed' }}>clients</span> disent
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '1.1rem' }}>Ils nous ont fait confiance et ils recommandent</p>
          </div>
          <Row>
            {testimonials.map((test, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '1px solid #2a2a2a',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', color: '#f59e0b' }}>
                    {[...Array(test.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p style={{ color: '#ffffff', fontStyle: 'italic', marginBottom: '15px' }}>"{test.text}"</p>
                  <h6 style={{ color: '#7c3aed', marginBottom: 0 }}>— {test.name}</h6>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>
              Prêt à rejoindre l'aventure ?
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
              Inscrivez-vous dès maintenant et bénéficiez de 10% de réduction sur votre première commande.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              style={{
                background: 'white',
                color: '#7c3aed',
                border: 'none',
                borderRadius: '40px',
                padding: '14px 40px',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}
            >
              Créer un compte gratuitement
            </Button>
          </motion.div>
        </Container>
      </section>
    </>
  );
};

export default Home;
