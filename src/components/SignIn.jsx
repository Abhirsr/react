import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';
import logo from '../assets/logo.png';
import { signin } from "../services/auth";
import supabase from "../supabaseClient";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signin({ email, password });
      if (result?.error) {
        console.error("Sign-in failed:", result.error.message);
      } else {
        navigate('/dashboard', { replace: true }); // ✅ Prevent back to signin
      }
    } catch (err) {
      console.error("Unexpected error during sign-in:", err.message);
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
            <button type="submit" className="signin-btn">Sign In</button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;