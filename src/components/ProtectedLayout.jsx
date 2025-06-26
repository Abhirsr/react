import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./ProtectedLayout.css";

const ProtectedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />

      <div className="content-wrapper">
        {/* Sidebar must ONLY be rendered here */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        <div className={`main-content-area ${isSidebarOpen ? "shifted" : ""}`}>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;