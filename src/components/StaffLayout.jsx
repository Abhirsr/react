// src/components/StaffLayout.jsx
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import StaffSidebar from './StaffSidebar';
import './Header.css';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const StaffLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        className="dashboard-header2"
        style={{
          width: '100%',
          height: 80,
          background: '#0356a8',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 32,
            cursor: 'pointer',
            position: 'absolute',
            left: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 11,
            padding: 0,
            lineHeight: 1,
          }}
          aria-label="Open sidebar"
        >
          &#9776;
        </button>

        {/* Title and Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 48, marginRight: 18 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>Staff Panel</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginTop: 2 }}>SCSVMV - Faculty Dashboard</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            position: 'absolute',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          Logout
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 2000,
            display: 'flex',
          }}
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="staff-sidebar"
            style={{
              position: 'relative',
              width: 250,
              height: '100vh',
              background: '#fff',
              boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
              zIndex: 2001,
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <StaffSidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 32px', background: '#f4f7fb' }}>
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;