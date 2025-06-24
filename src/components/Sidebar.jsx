import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserMd,
  FaClipboardList,
  FaUserClock,
  FaFileAlt,
  FaDoorOpen,
  FaInbox,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import supabase from "../supabaseClient";
import defaultAvatar from "../assets/avatar.png";
import "./Sidebar.css";

const Sidebar = ({ onClose, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(""); // added state

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
    if (onClose) onClose();
  };

  // 📌 Fetch profile image from Supabase
  useEffect(() => {
    const fetchProfileImage = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("profile_url")
        .eq("id", user.id)
        .single();

      if (!profileError && data?.profile_url) {
        setProfileImage(data.profile_url);
      }
    };

    fetchProfileImage();
  }, []);

  const requestCategories = [
    { label: "All Requests", path: "/requests" },
    { label: "Medical Leave", path: "/requests?type=medicalleave" },
    { label: "On-duty Leave", path: "/requests?type=ondutyleave" },
    { label: "Internship", path: "/requests?type=internship" },
    { label: "Permission", path: "/requests?type=permission" },
    { label: "Leave Form", path: "/requests?type=leaveform" },
    { label: "Gate-pass", path: "/requests?type=gatepass" },
  ];

  const isActiveRequest = (path) => {
    const [pathname, query] = path.split("?");
    return (
      location.pathname === pathname &&
      (query ? location.search === `?${query}` : location.search === "")
    );
  };

  return (
    <div className={`sidebar glass-panel ${isOpen ? "open" : "closed"}`}>
      {/* Scrollable content */}
      <div className="sidebar-scrollable">
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
          <li
            className={location.pathname === "/medicalleave" ? "active" : ""}
            onClick={() => handleNavigation("/medicalleave")}
          >
            <FaUserMd />
            <span className="text">Medical Leave</span>
          </li>
          <li
            className={location.pathname === "/ondutyleave" ? "active" : ""}
            onClick={() => handleNavigation("/ondutyleave")}
          >
            <FaUserClock />
            <span className="text">On-duty Leave</span>
          </li>
          <li
            className={
              location.pathname === "/internshippermission" ? "active" : ""
            }
            onClick={() => handleNavigation("/internshippermission")}
          >
            <FaClipboardList />
            <span className="text">Internship</span>
          </li>
          <li
            className={location.pathname === "/leaveform" ? "active" : ""}
            onClick={() => handleNavigation("/leaveform")}
          >
            <FaFileAlt />
            <span className="text">Leave Form</span>
          </li>
          <li
            className={location.pathname === "/gatepass" ? "active" : ""}
            onClick={() => handleNavigation("/gatepass")}
          >
            <FaDoorOpen />
            <span className="text">Gate-pass</span>
          </li>

          {/* Dropdown */}
          <li
            className="dropdown-toggle"
            onClick={() => setRequestsOpen(!requestsOpen)}
          >
            <FaInbox />
            <span className="text">Requests</span>
            <span className="dropdown-icon">
              {requestsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </li>
          {requestsOpen &&
            requestCategories.map((item) => (
              <li
                key={item.path}
                className={`nested-request ${
                  isActiveRequest(item.path) ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="text">{item.label}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Bottom profile button */}
      <div className="bottom-area">
        <div
          className="profile-button"
          onClick={() => navigate("/profile", { replace: true })}
        >
          <span className="profile-text">Profile</span>
          <img
            src={profileImage || defaultAvatar}
            alt="Profile"
            className="profile-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;