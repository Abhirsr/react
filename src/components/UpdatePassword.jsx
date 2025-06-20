import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [hasRequestedReset, setHasRequestedReset] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        alert("Auth session missing!");
        navigate("/signin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("❌ ${error.message}");
    } else {
      alert("Password updated successfully!");
      windows.close();
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="update-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleUpdatePassword}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
