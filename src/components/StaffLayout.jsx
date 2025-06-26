import React, { useState } from 'react';
import StaffDashboard from './StaffDashboard';

const StaffLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ⬅ START CLOSED

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <StaffDashboard
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
    >
      {children}
    </StaffDashboard>
  );
};

export default StaffLayout;