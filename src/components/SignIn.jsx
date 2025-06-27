import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";
import googleIcon from "../assets/google.png";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        // ✅ Always redirect to root so RoleBasedRedirect can handle proper routing
        navigate("/");
      }
    };

    checkSession();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/oauth-callback", // ✅ Update in production
        },
      });

      if (error) {
        alert("Google Sign-In failed");
        console.error("Google SSO Error:", error.message);
      }
    } catch (err) {
      console.error("Google SSO Exception:", err.message);
      alert("Something went wrong with Google Sign-In.");
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-background"></div>
      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="google-btn enhanced-google-btn"
          >
            <img
              src={googleIcon}
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