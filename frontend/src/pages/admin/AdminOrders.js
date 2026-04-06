import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('tous');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'en attente': 'warning',
            'confirmée': 'info',
            'expédiée': 'primary',
            'livrée': 'success',
            'annulée': 'danger'
        };
        return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
    };

    const handleUpdateStatus = async () => {
        try {
            await updateOrderStatus(selectedOrder._id, newStatus);
            toast.success('Statut mis à jour');
            setShowModal(false);
            fetchOrders();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    if (loading) return <div className="text-center mt-5">Chargement...</div>;

    const filteredOrders = orders.filter(order => {
        const matchSearch = (order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (order.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'tous' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <Container className="mt-4">
            <h2 className="mb-4">📦 Gestion des commandes</h2>
            
            <Card className="mb-4 shadow-sm border-0 bg-light">
                <Card.Body>
                    <Row className="align-items-end">
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Rechercher</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="N° commande ou nom du client..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Filtrer par statut</Form.Label>
                                <Form.Select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="tous">Tous les statuts</option>
                                    <option value="en attente">⏳ En attente</option>
                                    <option value="confirmée">✅ Confirmée</option>
                                    <option value="expédiée">🚚 Expédiée</option>
                                    <option value="livrée">📦 Livrée</option>
                                    <option value="annulée">❌ Annulée</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="text-end">
                            <Button variant="outline-primary" onClick={fetchOrders} size="sm">
                                🔄 Actualiser
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>N° Commande</th>
                        <th>Client</th>
                        <th>Téléphone</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order._id}>
                            <td>{order.orderNumber || order._id.slice(-8)}</td>
                            <td>{order.user?.name || order.guestInfo?.name || order.shippingAddress?.fullName || 'Invité'}</td>
                            <td>{order.shippingAddress?.phone || '-'}</td>
                            <td><strong>{order.totalAmount} DT</strong></td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                                <Button size="sm" variant="info" className="me-2" onClick={() => showOrderDetails(order)}>
                                    📋 Détails
                                </Button>
                                <Button size="sm" variant="warning" onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus(order.status);
                                    setShowModal(true);
                                }}>
                                    🔄 Statut
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">
                                Aucune commande correspondante
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Détails de la commande */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>📋 Détails de la commande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h5 style={{ color: '#7c3aed', fontWeight: 'bold' }}>👤 Informations client</h5>
                                    <p style={{ color: '#ffffff' }}>
                                        <strong style={{ color: '#a3a3a3' }}>Nom:</strong> {selectedOrder.user?.name || selectedOrder.guestInfo?.name || selectedOrder.shippingAddress?.fullName}<br/>
                                        <strong style={{ color: '#a3a3a3' }}>Email:</strong> {selectedOrder.user?.email || selectedOrder.guestInfo?.email || '-'}<br/>
                                        <strong style={{ color: '#a3a3a3' }}>Téléphone 1:</strong> <span style={{ color: '#22c55e' }}>{selectedOrder.shippingAddress?.phone || '-'}</span><br/>
                                        <strong style={{ color: '#a3a3a3' }}>Téléphone 2:</strong> {selectedOrder.shippingAddress?.phone2 || '-'}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <h5 style={{ color: '#7c3aed', fontWeight: 'bold' }}>📍 Adresse de livraison</h5>
                                    <p style={{ color: '#ffffff' }}>
                                        <strong style={{ color: '#a3a3a3' }}>Adresse:</strong> {selectedOrder.shippingAddress?.address}<br/>
                                        <strong style={{ color: '#a3a3a3' }}>Région:</strong> <span style={{ color: '#f59e0b' }}>{selectedOrder.shippingAddress?.region}</span><br/>
                                        <strong style={{ color: '#a3a3a3' }}>Pays:</strong> {selectedOrder.shippingAddress?.country}
                                    </p>
                                </Col>
                            </Row>
                            
                            <h5 style={{ color: '#7c3aed', fontWeight: 'bold' }}>💬 Commentaire client</h5>
                            <p style={{ background: '#2a2a2a', padding: '12px', borderRadius: '10px', color: '#ffffff' }}>
                                {selectedOrder.shippingAddress?.comment || 'Aucun commentaire'}
                            </p>
                            
                            <h5 className="mt-3" style={{ color: '#7c3aed', fontWeight: 'bold' }}>🛒 Articles commandés</h5>
                            <ListGroup className="mb-3">
                                {selectedOrder.items?.map((item, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center" style={{ background: '#2a2a2a', color: '#ffffff', borderColor: '#3a3a3a' }}>
                                        <div>
                                            <strong style={{ color: '#ffffff' }}>{item.name}</strong>
                                            <br />
                                            <small style={{ color: '#a3a3a3' }}>Prix unitaire: {item.price} DT</small>
                                            <br />
                                            <small style={{ color: '#a3a3a3' }}>x{item.quantity}</small>
                                        </div>
                                        <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {(item.price * item.quantity).toFixed(2)} DT
                                        </span>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="d-flex justify-content-between fw-bold" style={{ background: '#1a1a1a', color: '#ffffff', borderColor: '#3a3a3a' }}>
                                    <span>Total de la commande</span>
                                    <span style={{ color: '#7c3aed', fontSize: '1.2rem' }}>{selectedOrder.totalAmount?.toFixed(2)} DT</span>
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <div className="text-muted small mt-3" style={{ color: '#a3a3a3 !important' }}>
                                <strong style={{ color: '#ffffff' }}>N° commande:</strong> {selectedOrder.orderNumber}<br/>
                                <strong style={{ color: '#ffffff' }}>ID interne:</strong> {selectedOrder._id}<br/>
                                <strong style={{ color: '#ffffff' }}>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Fermer</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Changement statut */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le statut</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">
                        <strong>Commande:</strong> {selectedOrder?.orderNumber}<br/>
                        <strong>Client:</strong> {selectedOrder?.user?.name || selectedOrder?.guestInfo?.name || selectedOrder?.shippingAddress?.fullName}
                    </p>
                    <Form.Group>
                        <Form.Label>Nouveau statut</Form.Label>
                        <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <option value="en attente">⏳ En attente</option>
                            <option value="confirmée">✅ Confirmée</option>
                            <option value="expédiée">🚚 Expédiée</option>
                            <option value="livrée">📦 Livrée</option>
                            <option value="annulée">❌ Annulée</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>Enregistrer les modifications</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminOrders;
