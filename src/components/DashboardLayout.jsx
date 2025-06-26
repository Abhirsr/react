import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // assuming this exists
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} />

      <div className={`main-content ${sidebarOpen ? "shifted" : "collapsed"}`}>
        <div className="dashboard-body">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;