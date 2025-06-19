import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import  supabase  from '../supabaseClient';
import { uploadProofFile } from '../api/UploadProof';
import './OnDutyLeave.css';

const OnDutyLeave = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    reason: '',
    facultyEmail: '',
    fromDate: '',
    toDate: '',
    hours: '',
    proofFile: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      const fileUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(fileUrl);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let proofFileUrl = null;

      if (formData.proofFile) {
        const { publicUrl, error: uploadError } = await uploadProofFile(formData.proofFile);
        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Failed to upload proof file.');
          setSubmitting(false);
          return;
        }
        proofFileUrl = publicUrl;
      }

      const { error } = await supabase.from('onduty_leaves').insert([
        {
          event_name: formData.eventName,
          event_type: formData.eventType,
          reason: formData.reason,
          faculty_email: formData.facultyEmail,
          to_date: formData.toDate,
          hours: parseInt(formData.hours),
          proof_file_url: proofFileUrl,
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
        alert('Failed to submit leave application.');
      } else {
        alert('On-duty leave application submitted successfully!');
        setFormData({
          eventName: '',
          eventType: '',
          reason: '',
          facultyEmail: '',
          fromDate: '',
          toDate: '',
          hours: '',
          proofFile: null,
        });
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An error occurred while submitting.');
    }

    setSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-btn" onClick={() => navigate('/Sidebar')}>☰</button>
        <div className="header-title">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="institution-names">
            <h3>श्रीचन्द्रशेखरेन्द्रसरस्वतीविश्वमहाविद्यालयः</h3>
            <h2>Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya</h2>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="leave-content">
        <h2>On-duty Leave Application</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input type="text" name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} required />
          <input type="text" name="eventType" placeholder="Event Type" value={formData.eventType} onChange={handleChange} required />
          <textarea name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange} required></textarea>
          <input type="email" name="facultyEmail" placeholder="Faculty Email" value={formData.facultyEmail} onChange={handleChange} required />
          <label>From Date:</label>
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
          <label>To Date:</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
          <input type="number" name="hours" placeholder="Number of Hours" value={formData.hours} onChange={handleChange} required />
          <label>Upload proof/letter of OD:</label>
          <input type="file" name="proofFile" onChange={handleChange} accept=".pdf, .jpg, .jpeg, .png" />

          {previewUrl && (
            <div className="preview-container">
              <h4>File Preview:</h4>
              {formData.proofFile && formData.proofFile.type.startsWith('image') ? (
                <img src={previewUrl} alt="Preview" className="file-preview" />
              ) : (
                <p>Selected file: {formData.proofFile.name}</p>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default OnDutyLeave;