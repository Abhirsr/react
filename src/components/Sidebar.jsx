import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onClose }) => {
  return (
    <div className="sidebar">
      <button className="back-btn" onClick={onClose}>← Back</button>
      <h2>Dashboard</h2>
      <ul>
        <li>Medical Leave</li>
        <li>On-duty Leave</li>
        <li>Internship Permission</li>
        <li>Leave Form</li>
        <li>Gate-pass</li>
        <li>Requests</li>
        <li>History</li>
      </ul>
    </div>
  );
};

export default Sidebar;