import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';
import logo from '../assets/logo.png';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    // Redirect to dashboard
    navigate('/dashboard');
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
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" required />
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