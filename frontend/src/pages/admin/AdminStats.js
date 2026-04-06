import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { getStats } from '../../services/statsService';
import toast from 'react-hot-toast';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#e879f9', '#f0abfc'];

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des statistiques...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4 mb-5">
            <h2 className="mb-4">📊 Dashboard Statistiques</h2>

            {/* Cartes KPI */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 style={{ color: '#a3a3a3' }}>Chiffre d'affaires</h5>
                        <h2 style={{ color: '#7c3aed', fontSize: '2.5rem' }}>{stats?.totalRevenue?.toFixed(2)} DT</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 style={{ color: '#a3a3a3' }}>Commandes totales</h5>
                        <h2 style={{ color: '#7c3aed', fontSize: '2.5rem' }}>{stats?.totalOrders}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 style={{ color: '#a3a3a3' }}>Produits en stock</h5>
                        <h2 style={{ color: '#7c3aed', fontSize: '2.5rem' }}>{stats?.totalProducts}</h2>
                    </Card>
                </Col>
            </Row>

            {/* Graphique commandes par jour */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 className="mb-3">📈 Commandes (7 derniers jours)</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats?.ordersByDay || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                <XAxis dataKey="_id" stroke="#a3a3a3" />
                                <YAxis stroke="#a3a3a3" />
                                <Tooltip 
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #7c3aed' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="count" name="Nombre" stroke="#7c3aed" strokeWidth={2} />
                                <Line type="monotone" dataKey="revenue" name="CA (DT)" stroke="#22c55e" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Graphique commandes par mois */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 className="mb-3">📊 Commandes (6 derniers mois)</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.ordersByMonth || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                <XAxis dataKey="_id" stroke="#a3a3a3" />
                                <YAxis stroke="#a3a3a3" />
                                <Tooltip 
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #7c3aed' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="count" name="Nombre commandes" fill="#7c3aed" />
                                <Bar dataKey="revenue" name="CA (DT)" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Top produits */}
            <Row>
                <Col md={12}>
                    <Card className="p-3" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <h5 className="mb-3">🏆 Top 5 produits les plus vendus</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats?.topProducts || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, totalSold }) => `${name}: ${totalSold}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="totalSold"
                                    nameKey="name"
                                >
                                    {(stats?.topProducts || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #7c3aed' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-3">
                            {stats?.topProducts?.map((product, idx) => (
                                <div key={idx} className="d-flex justify-content-between mb-2">
                                    <span>{product.name}</span>
                                    <span className="text-primary">{product.totalSold} vendus</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminStats;
