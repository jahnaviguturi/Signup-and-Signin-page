import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/api/dashboard');
                setUser(response.data.user);
            } catch (err) {
                // If unauthorized or error, redirect to login
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Force redirect anyway
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="glass-card">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="glass-card dashboard-card">
                {user ? <h1>Hi, {user.sub}!</h1> : <h1>Hi!</h1>}
                <button className="btn-secondary logout-btn" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
