import React from "react";
import "./SignUp.css";
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div className="signup-wrapper">
      {/* Blurred Background */}
      <div className="signup-background"></div>
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <img src={logo} alt="Logo" className="logo-img" />
          <h2>Sign up</h2>
        </div>

        <form>
          <div className="form-group">
            <input type="text" placeholder="Name" required />
          </div>

          <div className="form-group">
            <input type="email" placeholder="Email" required />
          </div>

          <div className="form-group">
            <input type="text" placeholder="Register number" required />
          </div>

          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
          <div className="remember-me">
            <input type="checkbox" id="remember"/>
            <label htmlFor="remember">Remember me</label>
        
          </div>
          <p className="signin-link">
            Already have account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}

export default SignUp;
