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
import EmailVerified from "./components/EmailVerified";
import UpdatePassword from "./components/UpdatePassword";
import OAuthCallback from "./components/OAuthCallback";

// ✅ Shared layout with Sidebar and toggle logic
const ProtectedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Pass toggleSidebar prop to the child component
  const childWithProps = React.cloneElement(children, {
    toggleSidebar,
  });

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      {childWithProps}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify" element={<EmailVerified />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Dashboard />
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

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;