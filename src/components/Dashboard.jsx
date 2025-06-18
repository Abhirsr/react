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
           <div className="institution-names">
            <h3>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
            <h2>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
          </div>
        </div>
        <div className="welcome-text">Welcome student !!</div>
      </header>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;