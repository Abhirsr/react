import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { uploadProofFile } from '../api/UploadProof';
import './OnDutyLeave.css';
const OnDutyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    register_number: '',
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
      // 🔐 Get the logged-in user's email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("User not logged in.");
        setSubmitting(false);
        return;
      }

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
        user_email: user.email, // ✅ include user's email
      };

      const { error: leaveError } = await supabase.from('onduty_leaves').insert(insertPayload);

      if (leaveError) {
        console.error('Supabase insert error (onduty_leaves):', leaveError);
        alert('Failed to submit on-duty leave.');
        setSubmitting(false);
        return;
      }

      const requestPayload = {
        name: formData.name,
        reg_no: formData.register_number,
        faculty_email: formData.facultyEmail,
        reason: 'On-Duty Leave',
        from_date: formData.fromDate,
        to_date: formData.toDate,
        submitted_at: new Date().toISOString(),
        type: 'ondutyleave',
        status: 'Pending',
        user_email: user.email, // ✅ include user's email
      };

      const { error: requestError } = await supabase.from('odrequests').insert(requestPayload);

      if (requestError) {
        console.error('Requests table insert error:', requestError);
        alert('Failed to record leave in requests.');
      }

      localStorage.setItem('user_register_number', formData.register_number);
      alert('On-duty leave submitted successfully!');
      navigate('/requests?type=ondutyleave',{replace:true});

      setFormData({
        name: '',
        register_number: '',
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
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong.');
    }

    setSubmitting(false);
  };

  return (
    <main className="leave-content">
      <div className="leave-box">
        <h2>On-duty Leave Application</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="register_number" placeholder="Register Number" value={formData.register_number} onChange={handleChange} required />
          <input type="text" name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} required />
          <input type="text" name="eventType" placeholder="Event Type" value={formData.eventType} onChange={handleChange} required />
          <textarea name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange} required />
          <input type="email" name="facultyEmail" placeholder="Faculty Email" value={formData.facultyEmail} onChange={handleChange} required />

          <div className="date-fields">
            <div className="date-group">
              <label htmlFor="fromDate">From Date</label>
              <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
            </div>
            <div className="date-group">
              <label htmlFor="toDate">To Date</label>
              <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
            </div>
          </div>

          <input
            type="number"
            name="hours"
            placeholder="Number of Hours"
            value={formData.hours}
            onChange={handleChange}
            required
          />

          <div className="file-upload-container">
            <label htmlFor="proofFile">Upload Proof</label>
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
              {formData.proofFile.type.startsWith('image') ? (
                <img src={previewUrl} alt="Preview" className="file-preview" />
              ) : (
                <p>{formData.proofFile.name}</p>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default OnDutyLeave;