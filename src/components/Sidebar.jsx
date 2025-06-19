import React from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="sidebar">
      <button className="back-btn" onClick={onClose}>← Back</button>
      <h2>Dashboard</h2>
      <ul>
        {[
          { name: 'Medical Leave', path: '/medicalleave' },
          { name: 'On-duty Leave', path: '/ondutyleave' },
          { name: 'Internship Permission', path: '/internshippermission' },
          { name: 'Leave Form', path: '/leaveform' },
          { name: 'Gate-pass', path: '/gatepass' },
          { name: 'Requests', path: '/requests' },
        ].map(({ name, path }) => (
          <li
            key={path}
            className={location.pathname === path ? 'active' : ''}
            onClick={() => handleNavigation(path)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;