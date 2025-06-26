import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import StaffSidebar from './StaffSidebar';

const StaffDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    };

    checkSession();
  }, [navigate]);

  // Detect if children is a table (for requests pages)
  const isTablePage = React.Children.toArray(children).some(
    (child) =>
      child &&
      child.type &&
      (child.type.name?.toLowerCase().includes('request') ||
        child.type.name?.toLowerCase().includes('table'))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        className="dashboard-header"
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
        {/* Menu Button */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 48, marginRight: 18 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>Staff Panel</div>
            <div style={{ fontWeight: 700, fontSize: 22, marginTop: 2 }}>SCSVMV - Faculty Dashboard</div>
          </div>
        </div>
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
            onClick={e => e.stopPropagation()}
          >
            <StaffSidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Main Content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '40px 32px',
            background: '#f4f7fb',
            overflowX: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          {/* Home card or table/content */}
          {(!children || !isTablePage) ? (
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '48px 56px',
                maxWidth: 900,
                margin: '40px auto 0 auto',
                textAlign: 'center',
              }}
            >
              {children || (
                <h2 style={{ margin: 0, fontWeight: 600, color: '#003366' }}>
                  Welcome, Staff Member!
                  <br />
                  You can view requests, approve/deny, and more.
                </h2>
              )}
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '32px 24px',
                width: '100%',
                minWidth: 0,
                margin: '0 auto',
                overflowX: 'auto',
              }}
            >
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;