import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { uploadMedicalCertificate } from "../api/uploadMedicalCertificate";
import "./MedicalLeave.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const MedicalLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    register_number: "",
    year: "",
    department: "",
    faculty_mail: "",
    from_date: "",
    to_date: "",
    proofFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.from_date || !formData.to_date) {
      alert("Please select both From and To dates.");
      setSubmitting(false);
      return;
    }

    try {
      let proofFileUrl = null;

      if (formData.proofFile) {
        const { publicUrl, error: uploadError } =
          await uploadMedicalCertificate(formData.proofFile);
        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("Failed to upload certificate.");
          setSubmitting(false);
          return;
        }
        proofFileUrl = publicUrl;
      }

      const submittedAt = new Date().toISOString();

      const { data: userData } = await supabase.auth.getUser();
      const submitted_by = userData?.user?.email;

      const { error: insertError } = await supabase
        .from("medical_leaves")
        .insert({
          name: formData.name,
          register_number: formData.register_number,
          year: formData.year,
          department: formData.department,
          faculty_mail: formData.faculty_mail,
          from_date: formData.from_date,
          to_date: formData.to_date,
          medical_certificate_url: proofFileUrl,
          created_at: submittedAt,
          submitted_by,
        });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert("Failed to submit medical leave.");
        setSubmitting(false);
        return;
      }

      const commonPayload = {
        name: formData.name,
        reg_no: formData.register_number,
        faculty_email: formData.faculty_mail,
        reason: "Medical Leave",
        from_date: formData.from_date,
        to_date: formData.to_date,
        submitted_at: submittedAt,
        type: "medicalleave",
        status: "Pending",
        medical_doc_path: proofFileUrl,
        submitted_by,
      };

      await supabase.from("staff_medical_leave_requests").insert(commonPayload);

      localStorage.setItem("user_register_number", formData.register_number);
      alert("Medical leave submitted successfully!");
      navigate("/requests?type=medicalleave", { replace: true });

      setFormData({
        name: "",
        register_number: "",
        year: "",
        department: "",
        faculty_mail: "",
        from_date: "",
        to_date: "",
        proofFile: null,
      });
      setPreviewUrl(null);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }

    setSubmitting(false);
  };

  return (
    <main className="leave-content">
      <div className="leave-box">
        <h2>Medical Leave Application</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="register_number" placeholder="Register Number" value={formData.register_number} onChange={handleChange} required />
          <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
          <input type="email" name="faculty_mail" placeholder="Faculty Mail" value={formData.faculty_mail} onChange={handleChange} required />

          <div className="date-row">
            <div className="date-group">
              <DatePicker
                id="from_date"
                value={formData.from_date ? dayjs(formData.from_date) : null}
                onChange={(date, dateString) =>
                  setFormData((prev) => ({ ...prev, from_date: dateString }))
                }
                placeholder="From Date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                required
              />
            </div>
            <div className="date-group">
              <DatePicker
                id="to_date"
                value={formData.to_date ? dayjs(formData.to_date) : null}
                onChange={(date, dateString) =>
                  setFormData((prev) => ({ ...prev, to_date: dateString }))
                }
                placeholder="To Date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                required
              />
            </div>
          </div>

          <div className="file-upload-container">
            <span className="upload-label">Upload Medical Certificate:</span>
            <input
              type="file"
              name="proofFile"
              id="proofFile"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
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

export default MedicalLeave;