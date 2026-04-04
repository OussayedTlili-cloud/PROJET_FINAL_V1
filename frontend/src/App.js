import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavigationBar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<div className="text-center mt-5"><h1>Bienvenue sur E-Shop</h1><p>Votre boutique en ligne</p></div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
