import React, { useEffect } from 'react';
import logo from '../assets/logo.png';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Dashboard = ({ toggleSidebar, children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        navigate('/signin');
        return;
      }

      // Session is valid — continue showing dashboard
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <div className="header-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="institution-names">
            <h3>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
            <h2>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;