import { useState } from 'react'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BusinessListPage from './pages/BusinessListPage';
import AboutUs from './pages/AboutUs';
function App() {
    const [count, setCount] = useState(0)

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<BusinessListPage />} />
            </Routes>
        </Router>
    )
}

export default App
