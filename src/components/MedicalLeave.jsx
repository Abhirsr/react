import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";
import { uploadMedicalCertificate } from "../api/uploadMedicalCertificate";
import "./MedicalLeave.css";

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
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      } else {
        console.error("Failed to get user email:", error);
      }
    };
    fetchUser();
  }, []);

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
      let proofFileUrl = null;

      if (formData.proofFile) {
        const { publicUrl, error: uploadError } = await uploadMedicalCertificate(formData.proofFile);
        if (uploadError) {
          alert("File upload failed.");
          console.error(uploadError);
          setSubmitting(false);
          return;
        }
        proofFileUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from("medical_leaves").insert({
        name: formData.name,
        register_number: formData.register_number,
        year: formData.year,
        department: formData.department,
        faculty_mail: formData.faculty_mail,
        from_date: formData.from_date,
        to_date: formData.to_date,
        medical_certificate_url: proofFileUrl,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert("Failed to submit medical leave.");
        setSubmitting(false);
        return;
      }

      const { error: requestError } = await supabase.from("requests").insert({
        name: formData.name,
        reg_no: formData.register_number,
        faculty_email: formData.faculty_mail,
        reason: "Medical Leave",
        from_date: formData.from_date,
        to_date: formData.to_date,
        submitted_at: new Date().toISOString(),
        type: "medicalleave",
        status: "Pending",
        user_email: userEmail, // 👈 Filter key for request listing
      });

      if (requestError) {
        console.error("Requests table insert error:", requestError);
        alert("Failed to record leave in requests.");
      }

      localStorage.setItem("user_register_number", formData.register_number);
      alert("Medical leave submitted successfully!");
      navigate("/requests?type=medicalleave",{replace:true});

      // Reset form
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
      <div className="form-container">
        <h2>Medical Leave Application</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="register_number" placeholder="Register Number" value={formData.register_number} onChange={handleChange} required />
          <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
          <input type="email" name="faculty_mail" placeholder="Faculty Mail" value={formData.faculty_mail} onChange={handleChange} required />

          <div className="date-fields">
            <div className="date-group">
              <label htmlFor="from_date">From Date</label>
              <input type="date" id="from_date" name="from_date" value={formData.from_date} onChange={handleChange} required />
            </div>
            <div className="date-group">
              <label htmlFor="to_date">To Date</label>
              <input type="date" id="to_date" name="to_date" value={formData.to_date} onChange={handleChange} required />
            </div>
          </div>

          <div className="file-upload-container">
            <label htmlFor="proofFile">Upload Medical Certificate</label>
            <input
              type="file"
              id="proofFile"
              name="proofFile"
              onChange={handleChange}
              accept="image/*,.pdf"
              required
            />
            {formData.proofFile && <span className="file-name">{formData.proofFile.name}</span>}
          </div>

          {previewUrl && (
            <div className="preview-container">
              <h4>Preview:</h4>
              {formData.proofFile.type.startsWith("image") ? (
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