import React, { useState, useEffect } from "react";
import "./SignUp.css";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/auth";
import supabase from "../supabaseClient";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const userEmail = session.user.email;
        const reg = userEmail.split("@")[0];
        const isStaff = reg.toLowerCase().startsWith("staff");

        // 🔁 Redirect based on role
        if (isStaff) {
          window.location.replace("/staff-dashboard");
        } else {
          window.location.replace("/dashboard");
        }
      }
    };

    checkSession();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const allowedDomain = "@kanchiuniv.ac.in";
    if (!email.endsWith(allowedDomain)) {
      alert(`Only ${allowedDomain} emails are allowed.`);
      return;
    }

    try {
      const { error } = await signup({ email, password, name, regNumber });
      if (!error) {
        alert("Registration successful! Please sign in.");
        window.location.replace("/signin"); // 🔁 replaces instead of push
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-background"></div>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <img src={logo} alt="Logo" className="logo-img" />
            <h2>CREATE ACCOUNT</h2>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                type="text"
                placeholder="Register number"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
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

            <button type="submit" className="signup-btn">
              Sign Up
            </button>

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label htmlFor="remember"> Remember me</label>
            </div>

            <p className="signin-link">
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;