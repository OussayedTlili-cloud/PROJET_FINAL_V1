import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import NavigationBar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminDashboard from './pages/admin/AdminDashboard';
import Checkout from './pages/Checkout';
import CheckoutGuest from './pages/CheckoutGuest';
import MyOrders from './pages/MyOrders';
import OrderConfirmation from './pages/OrderConfirmation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Toaster position="bottom-right" reverseOrder={false} />
                    <NavigationBar />
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout-guest" element={<CheckoutGuest />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
