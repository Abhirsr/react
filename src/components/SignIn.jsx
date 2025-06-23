import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        const storedRole = localStorage.getItem("login_role");
        const redirectTo =
          storedRole === "staff" ? "/staff-dashboard" : "/dashboard";

        localStorage.removeItem("login_role");
        window.location.replace(redirectTo);
      }
    };

    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    // Optional: Set default role as student (or adjust if needed)
    localStorage.setItem("login_role", "student");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/oauth-callback", // ✅ Adjust if deployed
        },
      });

      if (error) {
        alert("Google Sign-In failed");
        console.error("Google SSO Error:", error.message);
        localStorage.removeItem("login_role");
      }
    } catch (err) {
      console.error("Google SSO Exception:", err.message);
      alert("Something went wrong with Google Sign-In.");
      localStorage.removeItem("login_role");
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-background"></div>
      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <img src={logo} alt="Logo" className="logo-img" />
            <h2>Sign In</h2>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="google-btn enhanced-google-btn"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google Logo"
              className="google-icon"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
