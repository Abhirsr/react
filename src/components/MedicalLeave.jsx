import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import supabase from "../supabaseClient";
import { uploadProofFile } from "../api/UploadProof";
import "./MedicalLeave.css";

const MedicalLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    reg_no: "",
    year: "",
    department: "",
    from_date: "",
    to_date: "",
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
      let proofFileUrl = null;

      if (formData.proofFile) {
        const { publicUrl, error: uploadError } = await uploadProofFile(
          formData.proofFile
        );
        if (uploadError) {
          alert("File upload failed.");
          console.error(uploadError);
          setSubmitting(false);
          return;
        }
        proofFileUrl = publicUrl;
      }

      const { error } = await supabase.from("medical_leaves").insert({
        name: formData.name,
        register_number: formData.reg_no, // ✅ match SQL
        year: formData.year,
        department: formData.department,
        from_date: formData.from_date,
        to_date: formData.to_date,
        medical_certificate_url: proofFileUrl, // ✅ match SQL
      });

      if (error) {
        console.error(error);
        alert("Failed to submit medical leave.");
      } else {
        alert("Medical leave submitted successfully!");
        setFormData({
          name: "",
          reg_no: "",
          year: "",
          department: "",
          from_date: "",
          to_date: "",
          proofFile: null,
        });
        setPreviewUrl(null);
      }
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-btn" onClick={() => navigate("/dashboard")}>
          ☰
        </button>
        <div className="header-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="institution-names">
            <h3>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
            <h2>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="leave-content">
        <h2>Medical Leave Application</h2>
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
            name="reg_no"
            placeholder="Register Number"
            value={formData.reg_no}
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
          <label>From Date:</label>
          <input
            type="date"
            name="from_date"
            value={formData.from_date}
            onChange={handleChange}
            required
          />
          <label>To Date:</label>
          <input
            type="date"
            name="to_date"
            value={formData.to_date}
            onChange={handleChange}
            required
          />
          <label>Upload Medical Certificate:</label>
          <input
            type="file"
            name="proofFile"
            onChange={handleChange}
            accept=".pdf, .jpg, .jpeg, .png"
          />

          {previewUrl && (
            <div className="preview-container">
              <h4>File Preview:</h4>
              {formData.proofFile &&
              formData.proofFile.type.startsWith("image") ? (
                <img src={previewUrl} alt="Preview" className="file-preview" />
              ) : (
                <p>Selected file: {formData.proofFile.name}</p>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default MedicalLeave;
