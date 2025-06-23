import React from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserMd,
  FaClipboardList,
  FaUserClock,
  FaFileAlt,
  FaDoorOpen,
  FaInbox,
  FaHome,
} from "react-icons/fa";
import defaultAvatar from "../assets/avatar.png";
import avatar2 from "../assets/account.png";

const Sidebar = ({ onClose, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { name: "Medical Leave", path: "/medicalleave", icon: <FaUserMd /> },
    { name: "On-duty Leave", path: "/ondutyleave", icon: <FaUserClock /> },
    {
      name: "Internship Permission",
      path: "/internshippermission",
      icon: <FaClipboardList />,
    },
    { name: "Leave Form", path: "/leaveform", icon: <FaFileAlt /> },
    { name: "Gate-pass", path: "/gatepass", icon: <FaDoorOpen /> },
    { name: "Requests", path: "/requests", icon: <FaInbox /> },
  ];

  return (
    <div className={`sidebar glass-panel ${isOpen ? "open" : "closed"}`}>
      <div
        className={`sidebar-header ${
          location.pathname === "/dashboard" ? "active" : ""
        }`}
        onClick={() => handleNavigation("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img src={defaultAvatar} alt="User" className="avatar2" />
        <div className="user-info">
          <h3>Home</h3>
        </div>
      </div>

      <ul className="nav-list">
        {menuItems.map(({ name, path, icon }, index) => (
          <li
            key={path}
            className={location.pathname === path ? "active" : ""}
            onClick={() => handleNavigation(path)}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <span className="icon">{icon}</span>
            <span className="text">{name}</span>
          </li>
        ))}
      </ul>

      <div className="bottom-area">
        <div className="profile-button" onClick={() => navigate("/profile")}>
          <span className="profile-text">Profile</span>
          <img src={avatar2} alt="Profile" className="profile-icon" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
