import React from "react";
import "./SignUp.css";
import logo from "../assets/logo-2022.jpg";

function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <img src={logo} alt="Logo" className="logo-img" />
          <h2>Sign Up</h2>
        </div>

        <form>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Register Number:</label>
            <input type="text" placeholder="Enter register number" required />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
