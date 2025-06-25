// DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} />
      <div
        className={`main-content ${sidebarOpen ? "shifted" : "collapsed"}`}
      >
        <header className="dashboard-header">
          {/* your fixed header content here */}
        </header>
        <div className="dashboard-body">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;