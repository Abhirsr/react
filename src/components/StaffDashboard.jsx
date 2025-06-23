import React, { useEffect } from 'react';
import logo from '../assets/logo.png';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const StaffDashboard = ({ toggleSidebar, children }) => {
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

      const email = session.user.email;
      const reg = email.split("@")[0];
      const isStaff = reg.toLowerCase().startsWith("staff");

      if (!isStaff) {
        navigate('/dashboard');
      }
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
            <h3>Staff Panel</h3>
            <h2>SCSVMV - Faculty Dashboard</h2>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <main className="dashboard-content">
        {children || <p>Welcome, Staff Member! You can view requests, approve/deny, and more.</p>}
      </main>
    </div>
  );
};

export default StaffDashboard;