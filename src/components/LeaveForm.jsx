import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";
import "./LeaveForm.css";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";

const Leave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    year: "",
    department: "",
    faculty_mail: "",
    reason: "",
    address: "",
    from_date: "",
    to_date: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not logged in");
        setSubmitting(false);
        return;
      }

      // Insert into leave_forms table
      const { error: formError } = await supabase.from("leave_forms").insert({
        name: formData.name,
        register_number: formData.register_number,
        year: formData.year,
        department: formData.department,
        faculty_mail: formData.faculty_mail,
        reason: formData.reason,
        address: formData.address,
        from_date: formData.from_date,
        to_date: formData.to_date,
        created_at: new Date().toISOString(),
        user_email: user.email,
      });

      if (formError) {
        console.error("Supabase insert error:", formError);
        alert("Failed to submit Leave Form.");
        setSubmitting(false);
        return;
      }

      // Insert into leave_requests table
      const { error: requestError } = await supabase.from("leave_requests").insert([
        {
          name: formData.name,
          reg_no: formData.register_number,
          faculty_email: formData.faculty_mail,
          reason: "Leave Form",
          from_date: formData.from_date,
          to_date: formData.to_date,
          submitted_at: new Date().toISOString(),
          type: "leaveform",
          status: "Pending",
          user_email: user.email,
        },
      ]);

      if (requestError) {
        console.error("Request insert error:", requestError);
        alert("Leave form saved but request logging failed.");
      }

      localStorage.setItem("user_register_number", formData.register_number);
      alert("Leave Form submitted successfully!");
      setFormData({
        name: "",
        register_number: "",
        year: "",
        department: "",
        faculty_mail: "",
        reason: "",
        address: "",
        from_date: "",
        to_date: "",
      });
      setFromDate(null);
      setToDate(null);
      navigate("/requests?type=leaveform");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }

    setSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/signin");
  };

  return (
    <main className="Leave-content">
      <div className="Leaveform-container">
        <h2>Leave Application</h2>
        <form onSubmit={handleSubmit} className="Leave-form">
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
            name="register_number"
            placeholder="Register Number"
            value={formData.register_number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="faculty_mail"
            placeholder="Faculty Mail"
            value={formData.faculty_mail}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="date-fields">
            <div className="date-group">
              <DatePicker
                value={fromDate ? dayjs(fromDate) : null}
                onChange={(date, dateString) => {
                  setFromDate(dateString);
                  setFormData((prev) => ({ ...prev, from_date: dateString }));
                }}
                placeholder="From Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                required
              />
            </div>
            <div className="date-group">
              <DatePicker
                value={toDate ? dayjs(toDate) : null}
                onChange={(date, dateString) => {
                  setToDate(dateString);
                  setFormData((prev) => ({ ...prev, to_date: dateString }));
                }}
                placeholder="To Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                required
              />
            </div>
          </div>

          <div className="submit-btn-container">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Leave;