import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";
import { uploadInternshipOfferLetter } from "../api/uploadInternshipOfferLetter";
import "./internship.css";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";

const InternshipForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    department: "",
    company_name: "",
    mentor_name: "",
    incharge_mail: "",
    start_date: "",
    end_date: "",
    offerLetter: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let offerLetterUrl = null;
      if (formData.offerLetter) {
        const { publicUrl, error: uploadError } =
          await uploadInternshipOfferLetter(formData.offerLetter);
        if (uploadError) {
          alert("Offer letter upload failed.");
          console.error(uploadError);
          setSubmitting(false);
          return;
        }
        offerLetterUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from("internship_applications")
        .insert({
          name: formData.name,
          register_number: formData.register_number,
          department: formData.department,
          company_name: formData.company_name,
          mentor_name: formData.mentor_name,
          incharge_mail: formData.incharge_mail,
          start_date: formData.start_date,
          end_date: formData.end_date,
          offer_letter_url: offerLetterUrl,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert("Failed to submit internship application.");
        setSubmitting(false);
        return;
      }

      // 👇 Insert into `requests` table
      const user = await supabase.auth.getUser();
      const userEmail = user?.data?.user?.email || "";

      const { error: requestError } = await supabase.from("staffinternshiprequests").insert({
        name: formData.name,
        reg_no: formData.register_number,
        faculty_email: formData.incharge_mail,
        reason: "Internship",
        from_date: formData.start_date,
        to_date: formData.end_date,
        submitted_at: new Date().toISOString(),
        type: "internship",
        status: "Pending",
        user_email: userEmail,
      });

      if (requestError) {
        console.error("Requests table insert error:", requestError);
        alert("Failed to record internship in requests.");
      }

      alert("Internship application submitted successfully!");
      setFormData({
        name: "",
        register_number: "",
        department: "",
        company_name: "",
        mentor_name: "",
        incharge_mail: "",
        start_date: "",
        end_date: "",
        offerLetter: null,
      });
      setStartDate(null);
      setEndDate(null);
      navigate("/requests?type=internship", { replace: true });
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
    <main className="internship-content">
      <div className="internship-container">
        <h2>Internship Application Form</h2>
        <form onSubmit={handleSubmit} className="internship-form">
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
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mentor_name"
            placeholder="Mentor Name"
            value={formData.mentor_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="incharge_mail"
            placeholder="Incharge Mail"
            value={formData.incharge_mail}
            onChange={handleChange}
            required
          />

          <div className="date-fields">
            <div className="date-group">
              <DatePicker
                value={startDate ? dayjs(startDate) : null}
                onChange={(date, dateString) => {
                  setStartDate(dateString);
                  setFormData((prev) => ({ ...prev, start_date: dateString }));
                }}
                placeholder="Start Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                required
              />
            </div>
            <div className="date-group">
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={(date, dateString) => {
                  setEndDate(dateString);
                  setFormData((prev) => ({ ...prev, end_date: dateString }));
                }}
                placeholder="End Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                required
              />
            </div>
          </div>

          <div className="file-upload-container">
            <label htmlFor="offerLetter">Upload Offer Letter</label>
            <input
              type="file"
              id="offerLetter"
              name="offerLetter"
              onChange={handleChange}
              accept="image/*,.pdf"
              required
            />
            {formData.offerLetter && (
              <span className="file-name">{formData.offerLetter.name}</span>
            )}
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

export default InternshipForm;
