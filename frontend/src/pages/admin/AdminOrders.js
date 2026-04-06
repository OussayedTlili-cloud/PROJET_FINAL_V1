import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Row, Col, ListGroup } from 'react-bootstrap';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

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

    return (
        <Container className="mt-4">
            <h2 className="mb-4">📦 Gestion des commandes</h2>
            <p className="text-muted mb-4">Total: {orders.length} commande(s)</p>
            
            <Table striped bordered hover responsive>
                <thead>
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
                    {orders.map(order => (
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
                                    <h5>👤 Informations client</h5>
                                    <p>
                                        <strong>Nom:</strong> {selectedOrder.user?.name || selectedOrder.guestInfo?.name || selectedOrder.shippingAddress?.fullName}<br/>
                                        <strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.guestInfo?.email || '-'}<br/>
                                        <strong>Téléphone 1:</strong> {selectedOrder.shippingAddress?.phone || '-'}<br/>
                                        <strong>Téléphone 2:</strong> {selectedOrder.shippingAddress?.phone2 || '-'}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <h5>📍 Adresse de livraison</h5>
                                    <p>
                                        <strong>Adresse:</strong> {selectedOrder.shippingAddress?.address}<br/>
                                        <strong>Région:</strong> {selectedOrder.shippingAddress?.region}<br/>
                                        <strong>Pays:</strong> {selectedOrder.shippingAddress?.country}
                                    </p>
                                </Col>
                            </Row>
                            
                            <h5>📝 Commentaire client</h5>
                            <p className="bg-light p-2 rounded">{selectedOrder.shippingAddress?.comment || 'Aucun commentaire'}</p>
                            
                            <h5 className="mt-3">🛒 Articles commandés</h5>
                            <ListGroup className="mb-3">
                                {selectedOrder.items?.map((item, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{(item.price * item.quantity).toFixed(2)} DT</span>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="d-flex justify-content-between fw-bold bg-light">
                                    <span>Total</span>
                                    <span>{selectedOrder.totalAmount?.toFixed(2)} DT</span>
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <div className="text-muted small">
                                <strong>N° commande:</strong> {selectedOrder.orderNumber}<br/>
                                <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}<br/>
                                <strong>Statut actuel:</strong> {getStatusBadge(selectedOrder.status)}
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
                    <p><strong>Commande:</strong> {selectedOrder?.orderNumber}</p>
                    <p><strong>Client:</strong> {selectedOrder?.user?.name || selectedOrder?.guestInfo?.name || selectedOrder?.shippingAddress?.fullName}</p>
                    <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        <option value="en attente">⏳ En attente</option>
                        <option value="confirmée">✅ Confirmée</option>
                        <option value="expédiée">🚚 Expédiée</option>
                        <option value="livrée">📦 Livrée</option>
                        <option value="annulée">❌ Annulée</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                    <Button variant="primary" onClick={handleUpdateStatus}>Enregistrer</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminOrders;
