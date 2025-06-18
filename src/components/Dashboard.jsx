import React from 'react';
import logo from '../assets/logo.png';
import './Dashboard.css';

const Dashboard = ({ toggleSidebar, children }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <div className="header-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
           <div>
    <h3 style={{ margin: 0, fontSize: '16px', lineHeight: '2',textAlign:'center' }}>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
    <h2 style={{ margin: 0, fontSize: '20px' }}>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
  </div>


        </div>
        <div className="welcome-text">Welcome student !!</div>
      </header>

      {/* Page content area */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;