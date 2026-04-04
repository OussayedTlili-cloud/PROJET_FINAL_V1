import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<div>Page d'accueil - E-commerce</div>} />
                    <Route path="/login" element={<div>Page de connexion</div>} />
                    <Route path="/register" element={<div>Page d'inscription</div>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
