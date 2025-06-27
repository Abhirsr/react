// src/components/StaffDashboard.jsx
import React from 'react';

const StaffDashboard = () => {
  return (
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
      <h2 style={{ margin: 0, fontWeight: 600, color: '#003366' }}>
        Welcome, Staff Member!
        <br />
        You can view requests, approve/deny, and more.
      </h2>
    </div>
  );
};

export default StaffDashboard;