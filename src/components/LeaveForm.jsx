import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './LeaveForm.css';

const LeaveForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Leave form submitted!');
    // Handle submission logic here
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
      <main className="leave-content">
        <h2>Leave Application Form</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="regNo"
            placeholder="Registration Number"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
          <textarea
            name="reason"
            placeholder="Reason for Leave"
            value={formData.reason}
            onChange={handleChange}
            required
          />
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </main>
  );
};

export default LeaveForm;