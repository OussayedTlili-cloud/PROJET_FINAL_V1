import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Card, Row, Col } from 'react-bootstrap';
import { getMyOrders } from '../services/orderService';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Erreur lors du chargement de vos commandes');
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
        return <Badge bg={colors[status] || 'secondary'} className="px-3 py-2 rounded-pill fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>{status}</Badge>;
    };

    if (loading) return (
        <Container className="text-center mt-5 mb-5 py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Récupération de votre historique...</p>
        </Container>
    );

    return (
        <Container className="mt-5 mb-5 py-4">
            <div className="mb-5">
                <h1 className="fw-bold display-6 mb-1">📦 Mes Commandes</h1>
                <p className="text-muted">Consultez l'historique et le statut de vos achats RetroPlay</p>
            </div>

            {orders.length === 0 ? (
                <Card className="text-center p-5 border-0 shadow-sm" style={{ borderRadius: '24px' }}>
                    <Card.Body>
                        <div className="fs-1 mb-3 text-muted opacity-50">🕹️</div>
                        <h4 className="fw-bold">Aucune commande pour le moment</h4>
                        <p className="text-muted mb-4">Votre historique apparaîtra ici dès que vous aurez passé votre première commande.</p>
                        <a href="/products" className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm">
                            Explorer la boutique
                        </a>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                    <Table hover responsive className="mb-0">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="py-3 ps-4">N° Commande</th>
                                <th className="py-3">Date</th>
                                <th className="py-3">Articles</th>
                                <th className="py-3 text-center">Total</th>
                                <th className="py-3 text-center">Statut</th>
                                <th className="py-3 pe-4">Livraison</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {orders.map(order => (
                                <tr key={order._id} className="align-middle">
                                    <td className="ps-4 fw-bold text-primary">
                                        {order.orderNumber || order._id.slice(-8)}
                                    </td>
                                    <td className="text-muted">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="small fw-semibold">{order.items.length} article(s)</div>
                                        <div className="text-muted smaller" style={{ fontSize: '0.75rem' }}>
                                            {order.items.map(i => i.name).join(', ').substring(0, 40)}...
                                        </div>
                                    </td>
                                    <td className="text-center fw-bold text-success">
                                        {order.totalAmount.toFixed(2)} DT
                                    </td>
                                    <td className="text-center">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="pe-4 text-muted small">
                                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={order.shippingAddress.address}>
                                            📍 {order.shippingAddress.address}
                                        </div>
                                        <div className="fw-bold">{order.shippingAddress.region}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}

            <style>
                {`
                .smaller { font-size: 0.8rem; }
                tbody tr:hover { background-color: rgba(13, 110, 253, 0.02) !important; }
                `}
            </style>
        </Container>
    );
};

export default MyOrders;
