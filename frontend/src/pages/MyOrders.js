import React, { useState, useEffect } from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import { getMyOrders } from '../services/orderService';

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
            console.error('Erreur:', error);
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

    if (loading) return <div className="text-center mt-5">Chargement...</div>;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Mes Commandes</h2>
            {orders.length === 0 ? (
                <p>Aucune commande pour le moment</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Articles</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Adresse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.items.length} article(s)</td>
                                <td>{order.totalAmount.toFixed(2)} DT</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                 </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MyOrders;
