import { useState } from 'react'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BusinessListPage from './pages/BusinessListPage';
import AboutUs from './pages/AboutUs';
import BusinessProfilePage from './pages/BusinessProfilePage';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessDetailsPage from './pages/BusinessDetailsPage';
import CampaignPage from './pages/CampaignPage';
import AdminCampaignPage from './pages/AdminCampaignPage';
import BusinessOfferingDetailsPage from './pages/BusinessOfferingDetailsPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<BusinessListPage />} />
                <Route path="/profile" element={<BusinessProfilePage />} />
                <Route path="/business/:slug" element={<BusinessDetailsPage />} />
                <Route path="/business/offering/:slug" element={<BusinessOfferingDetailsPage />} />
                <Route path="/dashboard" element={<BusinessDashboard />} />
                <Route path="/campaign" element={<CampaignPage />} />
                <Route path="/admin/campaign" element={<AdminCampaignPage />} />
                <Route path="/campaign/details/:id" element={<CampaignDetailsPage />} />
            </Routes>
        </Router>
    )
}

export default App
