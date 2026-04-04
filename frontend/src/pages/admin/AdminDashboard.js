import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', description: '', stock: '', category: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data);
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
            } else {
                await createProduct(data);
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur serveur'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce produit ?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Dashboard Admin</h2>
                <Button onClick={() => handleOpenModal()}>+ Ajouter Produit</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Catégorie</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td style={{ width: '50px' }}>
                                {product.imageUrl && <img src={`http://localhost:5000${product.imageUrl}`} alt="" style={{ width: '40px' }} />}
                            </td>
                            <td>{product.name}</td>
                            <td>{product.price} €</td>
                            <td>{product.stock}</td>
                            <td>{product.category}</td>
                            <td>
                                <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenModal(product)}>Modifier</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? 'Modifier' : 'Ajouter'} un produit</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prix (€)</Form.Label>
                                    <Form.Control type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Catégorie</Form.Label>
                                    <Form.Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                        <option value="">Choisir...</option>
                                        <option value="Accessoires">Accessoires</option>
                                        <option value="Consoles">Consoles</option>
                                        <option value="Jeux">Jeux</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
