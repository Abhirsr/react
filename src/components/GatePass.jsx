import React, { useState } from "react";
import "./GatePass.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient"; // 👈 create and import this file

const GatePass = () => {
  const [formData, setFormData] = useState({
    name: "",
    regno: "",
    hostel: "",
    place: "",
    hour: "12",
    minute: "00",
    ampm: "AM",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time = `${formData.hour}:${formData.minute} ${formData.ampm}`;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not logged in.");
        return;
      }

      // Insert into gate_passes table
      const { error: gatePassError } = await supabase
        .from("gate_passes")
        .insert([
          {
            name: formData.name,
            regno: formData.regno,
            hostel: formData.hostel,
            place: formData.place,
            time: time,
            created_at: new Date().toISOString(),
            user_email: user.email, // ✅ include user email for filtering later
          },
        ]);

      if (gatePassError) {
        console.error(gatePassError);
        alert("❌ Failed to submit gate pass. Try again.");
        return;
      }

      // Insert into gatepass_requests table
      const { error: requestError } = await supabase
        .from("gatepass_requests")
        .insert([
          {
            name: formData.name,
            reg_no: formData.regno,
            faculty_email: "", // Optional: you can add an input if needed
            reason: "Gate Pass",
            from_date: new Date().toISOString().split("T")[0],
            to_date: new Date().toISOString().split("T")[0],
            submitted_at: new Date().toISOString(),
            type: "gatepass",
            status: "Pending",
            user_email: user.email,
          },
        ]);

      if (requestError) {
        console.error("Requests table insert error:", requestError);
        alert("❌ Failed to record in requests table.");
        return;
      }

      alert("✅ Gate Pass Submitted!");
      // 🔔 Save notification in localStorage
const existingNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
const newNotification = {
  id: Date.now(),
  message: "✅ Gate pass submitted!",
};
const updatedNotifications = [newNotification, ...existingNotifications];
localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
localStorage.setItem("hasUnreadNotifications", "true");
      navigate("/requests?type=gatepass", { replace: true });

      setFormData({
        name: "",
        regno: "",
        hostel: "",
        place: "",
        hour: "12",
        minute: "00",
        ampm: "AM",
      });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
  };
  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="gatepass-content">
      <h2>GATE - PASS FORM</h2>
      <form className="gatepass-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="regno"
          placeholder="Reg No"
          value={formData.regno}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hostel"
          placeholder="Hostel Name"
          value={formData.hostel}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="place"
          placeholder="Place"
          value={formData.place}
          onChange={handleChange}
          required
        />

        <label className="time-label">⏰ Time</label>
        <div className="time-input-group">
          <select name="hour" value={formData.hour} onChange={handleChange}>
            {[...Array(12)].map((_, i) => {
              const val = String(i + 1).padStart(2, "0");
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })}
          </select>

          <select name="minute" value={formData.minute} onChange={handleChange}>
            {[
              "00",
              "05",
              "10",
              "15",
              "20",
              "25",
              "30",
              "35",
              "40",
              "45",
              "50",
              "55",
            ].map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>

          <select name="ampm" value={formData.ampm} onChange={handleChange}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default GatePass;
