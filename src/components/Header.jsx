import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Bell } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin', { replace: true });
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/signin', { replace: true });
      }
    };
    checkSession();

    // Load notifications
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const unread = localStorage.getItem("hasUnreadNotifications") === "true";

    setNotifications(savedNotifications);
    setHasUnread(unread);
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);

    // Mark as read when popup opens
    if (!showNotifications) {
      setHasUnread(false);
      localStorage.setItem("hasUnreadNotifications", "false");
    }
  };

  return (
    <header className="dashboard-header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <div className="header-title">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <div className="institution-names">
          <h3>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
          <h2>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
        </div>
      </div>

      <div className="header-right">
        <div className="notification-wrapper" onClick={toggleNotifications}>
          <Bell className="notification-icon" />
          {hasUnread && <span className="notification-dot" />}
          {showNotifications && (
            <div className="notification-popup">
              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <p key={note.id}>{note.message}</p>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;