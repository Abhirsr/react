// src/components/RoleBasedRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return; // Wait until role is fetched

    if (role === "faculty" || role === "hod") {
      navigate("/staff-dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [role, navigate]);

  return null;
};

export default RoleBasedRedirect;