import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/privateRoute";
import OnDutyLeave from "./components/OnDutyLeave";
import MedicalLeave from "./components/MedicalLeave";
import GatePass from "./components/GatePass";
import LeaveForm from "./components/LeaveForm";
import EmailVerified from "./components/EmailVerified"; // ✅ Import this new component
import UpdatePassword from "./components/UpdatePassword";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* ✅ Verification success route */}
        <Route path="/verify" element={<EmailVerified />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Dashboard toggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/ondutyleave"
          element={
            <PrivateRoute>
              <div className="app-container">
                <OnDutyLeave toggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/medicalleave"
          element={
            <PrivateRoute>
              <div className="app-container">
                <MedicalLeave toggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/gatepass"
          element={
            <PrivateRoute>
              <div className="app-container">
                <GatePass toggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              </div>
            </PrivateRoute>
          }
        />

        <Route
          path="/leaveform"
          element={
            <PrivateRoute>
              <div className="app-container">
                <LeaveForm toggleSidebar={toggleSidebar} />
                {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
              </div>
            </PrivateRoute>
          }
        />
        {/* ✅ added Update Password route */}
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* Catch-all: redirect to dashboard or signin */}
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
