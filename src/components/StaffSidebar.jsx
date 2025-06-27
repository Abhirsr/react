import React, { useState } from "react";
import "./StaffSidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaInbox,
  FaHome,
  FaChevronDown,
  FaStethoscope,
  FaBriefcase,
  FaUserCheck,
  FaClipboard
} from "react-icons/fa";
import logo from "../assets/logo.png";

const StaffSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRequestsMenu, setShowRequestsMenu] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  return (
    <div className="staff-sidebar glass-panel">
      <div
        className={`staff-sidebar-header ${
          location.pathname === "/staff-dashboard" ? "active" : ""
        }`}
        onClick={() => handleNavigation("/staff-dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="Staff" className="avatar2" />
        <div className="user-info">
          <h3>Staff Panel</h3>
        </div>
      </div>

      <ul className="nav-lists">
        <li
          className={location.pathname === "/staff-dashboard" ? "active" : ""}
          onClick={() => handleNavigation("/staff-dashboard")}
        >
          <span className="icon"><FaHome /></span>
          <span className="text">Home</span>
        </li>

        <li
          className="dropdown-toggle"
          onClick={() => setShowRequestsMenu((prev) => !prev)}
        >
          <span className="icon"><FaInbox /></span>
          <span className="text">Requests</span>
          <span style={{ marginLeft: "auto" }}><FaChevronDown /></span>
        </li>

        {showRequestsMenu && (
          <ul className="submenu">
            <li
              className={location.pathname === "/staff-medical-requests" ? "active" : ""}
              onClick={() => handleNavigation("/staff-medical-requests")}
            >
              <span className="icon"><FaStethoscope /></span>
              <span className="text submenu">Medical Leave Requests</span>
            </li>
            <li
              className={location.pathname === "/staff-onduty-requests" ? "active" : ""}
              onClick={() => handleNavigation("/staff-onduty-requests")}
            >
              <span className="icon"><FaBriefcase /></span>
              <span className="text submenu">On Duty</span>
            </li>
            <li
              className={location.pathname === "/requests/internship" ? "active" : ""}
              onClick={() => handleNavigation("/requests/internship")}
            >
              <span className="icon"><FaUserCheck /></span>
              <span className="text submenu">Internship Permission</span>
            </li>
            <li
              className={location.pathname === "/requests/leaveform" ? "active" : ""}
              onClick={() => handleNavigation("/requests/leaveform")}
            >
              <span className="icon"><FaClipboard /></span>
              <span className="text submenu">Leave Form</span>
            </li>
          </ul>
        )}
      </ul>

      <div className="bottom-area2">
        <div className="profile-button2" onClick={() => handleNavigation("/staff-profile")}>
          <span className="profile-text">Profile</span>
          <span className="profile-icon2">👤</span>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;