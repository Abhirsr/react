import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "./OnDutyLeave.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { uploadProofFile } from "../api/UploadProof";

const OnDutyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    eventName: "",
    eventType: "",
    reason: "",
    facultyEmail: "",
    fromDate: "",
    toDate: "",
    hours: "",
    proofFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get the logged-in user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("User not logged in.");
        setSubmitting(false);
        return;
      }

      let proofFileUrl = null;

      if (formData.proofFile) {
        const { publicUrl, error: uploadError } = await uploadProofFile(formData.proofFile);
        if (uploadError) {
          alert("Failed to upload proof.");
          setSubmitting(false);
          return;
        }
        proofFileUrl = publicUrl;
      }

      // Prevent submission if no proof file was uploaded
      if (!proofFileUrl) {
        alert("You must upload a proof document.");
        setSubmitting(false);
        return;
      }

      const insertPayload = {
        event_name: formData.eventName,
        event_type: formData.eventType,
        reason: formData.reason,
        faculty_email: formData.facultyEmail,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        hours: parseInt(formData.hours) || 0,
        proof_file_url: proofFileUrl,
        created_at: new Date().toISOString(),
        user_email: user.email,
        reg_no: formData.register_number,
      };

      const { error: leaveError } = await supabase
        .from("onduty_leaves")
        .insert(insertPayload);

      if (leaveError) {
        alert("OD leave insertion failed.");
        setSubmitting(false);
        return;
      }

      // Insert into odrequests
      const requestPayload = {
        reg_no: formData.register_number,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        od_doc_path: proofFileUrl,
        name: formData.name,
        faculty_email: formData.facultyEmail,
        reason: "On-Duty Leave",
        submitted_at: new Date().toISOString(),
        type: "ondutyleave",
        status: "Pending",
        user_email: user.email,
      };
      const { error: requestError } = await supabase
        .from("odrequests")
        .insert(requestPayload);

      if (requestError) {
        console.error("OD request recording failed:", requestError);
        alert("OD request recording failed.");
        setSubmitting(false);
        return;
      }

      alert("On-Duty Leave submitted successfully!");
      localStorage.setItem("user_register_number", formData.register_number);
      navigate("/requests?type=ondutyleave", { replace: true });

      setFormData({
        name: "",
        register_number: "",
        eventName: "",
        eventType: "",
        reason: "",
        facultyEmail: "",
        fromDate: "",
        toDate: "",
        hours: "",
        proofFile: null,
      });
      setPreviewUrl(null);
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred.");
    }

    setSubmitting(false);
  };

  return (
    <main className="leave-content">
      <div className="leave-box">
        <h2>On-duty Leave Application</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input name="register_number" placeholder="Register Number" value={formData.register_number} onChange={handleChange} required />
          <input name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} required />
          <input name="eventType" placeholder="Event Type" value={formData.eventType} onChange={handleChange} required />
          <textarea name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange} required />
          <input type="email" name="facultyEmail" placeholder="Faculty Email" value={formData.facultyEmail} onChange={handleChange} required />
          <div className="date-row">
            <DatePicker
              value={formData.fromDate ? dayjs(formData.fromDate) : null}
              onChange={(date, dateString) => setFormData((prev) => ({ ...prev, fromDate: dateString }))}
              placeholder="From Date"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              required
            />
            <DatePicker
              value={formData.toDate ? dayjs(formData.toDate) : null}
              onChange={(date, dateString) => setFormData((prev) => ({ ...prev, toDate: dateString }))}
              placeholder="To Date"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              required
            />
          </div>
          <input type="number" name="hours" placeholder="Number of Hours" value={formData.hours} onChange={handleChange} required />
          <div className="file-upload-row">
            <span className="upload-label">Upload OD Proof:</span>
            <input type="file" name="proofFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
          </div>
          {previewUrl && (
            <div className="preview-container">
              <h4>Preview:</h4>
              {formData.proofFile?.type?.startsWith("image") ? (
                <img src={previewUrl} alt="Preview" className="file-preview" />
              ) : (
                <p>{formData.proofFile.name}</p>
              )}
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default OnDutyLeave;