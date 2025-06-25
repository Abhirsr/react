import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/privateRoute";
import OnDutyLeave from "./components/OnDutyLeave";
import MedicalLeave from "./components/MedicalLeave";
import GatePass from "./components/GatePass";
import LeaveForm from "./components/LeaveForm";
import EmailVerified from "./components/EmailVerified";
import UpdatePassword from "./components/UpdatePassword";
import OAuthCallback from "./components/OAuthCallback";
import ProfilePage from "./components/ProfilePage";
import StaffDashboard from "./components/StaffDashboard";
import DashboardHome from "./components/DashboardHome";
import Request from "./pages/Request";
import ParticlesBackground from "./components/ParticleBackground";
import InternshipForm from "./components/internship";

// Shared layout with Sidebar and Header
const ProtectedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="dashboard-content" style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<EmailVerified />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <DashboardHome />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/medicalleave"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <MedicalLeave />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ondutyleave"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <OnDutyLeave />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/gatepass"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <GatePass />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leaveform"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <LeaveForm />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <StaffDashboard />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Request />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/internshippermission"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <InternshipForm />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
