import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', description: '', stock: '', category: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = ['Jeux vidéos', 'Figurine', 'Pièce de collection'];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des produits');
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                stock: product.stock,
                category: product.category
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', stock: '', category: '' });
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);
        
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, data);
                toast.success('Produit mis à jour');
            } else {
                await createProduct(data);
                toast.success('Produit créé avec succès');
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
            try {
                await deleteProduct(id);
                toast.success('Produit supprimé');
                fetchProducts();
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    return (
        <Container className="mt-5 mb-5 py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div>
                    <h1 className="fw-bold display-6 mb-1">Catalogue Produits</h1>
                    <p className="text-muted mb-0">Gérez votre stock et vos articles en ligne</p>
                </div>
                <Button 
                    variant="primary" 
                    className="rounded-pill px-4 py-2 fw-bold shadow-sm"
                    onClick={() => handleOpenModal()}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nouveau Produit
                </Button>
            </div>

            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-4">
                    <InputGroup className="bg-light rounded-pill px-3 py-1 border-0 shadow-none">
                        <InputGroup.Text className="bg-transparent border-0 text-muted">
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control 
                            placeholder="Rechercher un produit, une catégorie..." 
                            className="bg-transparent border-0 shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                <Table hover responsive className="mb-0">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="py-3 ps-4">Aperçu</th>
                            <th className="py-3">Nom</th>
                            <th className="py-3 text-center">Catégorie</th>
                            <th className="py-3 text-center">Prix</th>
                            <th className="py-3 text-center">Stock</th>
                            <th className="py-3 text-center pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="align-middle">
                                <td className="ps-4">
                                    <div className="rounded-3 overflow-hidden shadow-sm" style={{ width: '48px', height: '48px' }}>
                                        <img 
                                            src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : 'https://via.placeholder.com/50'} 
                                            alt="" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    </div>
                                </td>
                                <td className="fw-bold">{product.name}</td>
                                <td className="text-center">
                                    <Badge bg="light" text="dark" className="border shadow-xs">{product.category}</Badge>
                                </td>
                                <td className="text-center fw-bold text-primary">{product.price.toFixed(2)} DT</td>
                                <td className="text-center">
                                    <span className={`fw-bold ${product.stock <= 5 ? 'text-danger' : 'text-success'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="text-center pe-4">
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline-info" 
                                            className="rounded-circle p-2 border-0 bg-light"
                                            onClick={() => handleOpenModal(product)}
                                            title="Modifier"
                                        >
                                            <i className="bi bi-pencil-square fs-5"></i>
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline-danger" 
                                            className="rounded-circle p-2 border-0 bg-light"
                                            onClick={() => handleDelete(product._id)}
                                            title="Supprimer"
                                        >
                                            <i className="bi bi-trash3 fs-5"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="premium-modal">
                <Modal.Header closeButton className="border-0 pt-4 px-4">
                    <Modal.Title className="fw-bold fs-3">
                        {editingProduct ? 'Modifier le produit' : 'Créer un nouvel article'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="px-4 pb-4">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Nom du produit *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        required 
                                        className="bg-light border-0 py-3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Prix (DT) *</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01" 
                                        value={formData.price} 
                                        onChange={e => setFormData({...formData, price: e.target.value})} 
                                        required 
                                        className="bg-light border-0 py-3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Catégorie *</Form.Label>
                                    <Form.Select 
                                        value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value})} 
                                        required
                                        className="bg-light border-0 py-3"
                                    >
                                        <option value="">Choisir...</option>
                                        <option value="Jeux vidéos">Jeux vidéos</option>
                                        <option value="Figurine">Figurine</option>
                                        <option value="Pièce de collection">Pièce de collection</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Description détaillée *</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})} 
                                        required 
                                        className="bg-light border-0 py-3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Quantité en stock *</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={formData.stock} 
                                        onChange={e => setFormData({...formData, stock: e.target.value})} 
                                        required 
                                        className="bg-light border-0 py-3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted text-uppercase">Image du produit</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={e => setImageFile(e.target.files[0])} 
                                        className="bg-light border-0 py-2"
                                    />
                                    <Form.Text className="text-muted">Laissez vide pour conserver l'image actuelle</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0 px-4 pb-4">
                        <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button type="submit" variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow" disabled={loading}>
                            {loading ? 'Enregistrement...' : 'Valider'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
