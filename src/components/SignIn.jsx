import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signin.css";
import logo from "../assets/logo.png";
import { signin } from "../services/auth";
import supabase from "../supabaseClient";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasRequestedReset, setHasRequestedReset] = useState(false); // session-only

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        navigate("/dashboard", { replace: true });
      }
    };

    if (window.location.pathname === "/signin") {
      checkSession();
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const allowedDomain = "@kanchiuniv.ac.in";

    if (!email.endsWith(allowedDomain)) {
      alert(`Only ${allowedDomain} emails are allowed.`);
      return;
    }

    try {
      const result = await signin({ email, password });

      if (result?.error) {
        alert(result.error.message || "Sign-in failed.");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Sign-in error:", err.message);
      alert("Something went wrong.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    if (hasRequestedReset) {
      alert("You've already requested a reset link this session.");
      return;
    }

    setHasRequestedReset(true); // disable for current session

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password",
      });

      if (error) {
        alert("Failed to send reset email. Try again.");
        setHasRequestedReset(false);
      } else {
        alert("Reset link sent! Refresh page to request again.");
      }
    } catch (err) {
      console.error("Reset error:", err.message);
      alert("Something went wrong.");
      setHasRequestedReset(false);
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

          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/">Sign Up</Link>
          </div>

          <div className="forgot-password-link">
            <button
              onClick={handleForgotPassword}
              className="forgot-btn"
              disabled={hasRequestedReset}
            >
              {hasRequestedReset
                ? "Reset Link Sent (Refresh to request again)"
                : "Forgot Password?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;