import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import CheckoutGuest from './pages/CheckoutGuest';
import CheckoutChoice from './pages/CheckoutChoice';
import OrderConfirmation from './pages/OrderConfirmation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout-guest" element={<CheckoutGuest />} />
                        <Route path="/checkout-choice" element={<CheckoutChoice />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                    </Routes>
                    <Footer />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
