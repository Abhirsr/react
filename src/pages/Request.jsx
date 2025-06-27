import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import './Request.css';

const TABLE_MAP = {
  medicalleave: 'staff_medical_leave_requests',
  ondutyleave: 'odrequests',
  internship: 'staffinternshiprequests',
  leaveform: 'leave_requests',
  gatepass: 'gatepass_requests',
};

const REASON_MAP = {
  medicalleave: 'Medical Leave',
  ondutyleave: 'On-Duty Leave',
  internship: 'Internship Permission',
  leaveform: 'Leave Form',
  gatepass: 'Gate Pass',
};

const Request = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const type = query.get('type'); // 'medicalleave', 'ondutyleave', etc.

  useEffect(() => {
    getCurrentUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) fetchRequests();
  }, [type, userEmail]);

  const getCurrentUserEmail = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user?.email) {
      setUserEmail(data.user.email);
    } else {
      console.error('Failed to get user email:', error);
    }
  };

  const fetchRequests = async () => {
    const table = TABLE_MAP[type];
    if (!table) {
      console.error('Invalid request type or missing table mapping');
      return;
    }

    let request = supabase.from(table).select('*');

    // Filter by user_email for all tables except medical leave
    if (type !== 'medicalleave') {
      request = request.eq('user_email', userEmail);
    }

    const { data, error } = await request.order('submitted_at', {
      ascending: false,
    });

    if (error) {
      console.error(`Fetch Error from ${table}:`, error);
    } else {
      setLeaveRequests(data);
    }
  };

  const readableType = REASON_MAP[type] || 'Leave';

  return (
    <main className="requests-content">
      <h2>{type ? `${readableType} Requests` : 'All Leave Requests'}</h2>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg No</th>
            <th>Faculty Email</th>
            <th>Reason</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.reg_no}</td>
                <td>{req.faculty_email}</td>
                <td>{req.reason || readableType}</td>
                <td>{req.from_date}</td>
                <td>{req.to_date}</td>
                <td>{req.status || 'Pending'}</td>
                <td>{new Date(req.submitted_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Request;