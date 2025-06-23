import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import './Request.css';

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
    let request = supabase.from('requests').select('*');

    if (type) {
      request = request.eq('reason', convertTypeToReason(type));
    }

    request = request.eq('user_email', userEmail); // 👈 filter by logged-in user

    const { data, error } = await request.order('submitted_at', {
      ascending: false,
    });

    if (error) {
      console.error('Fetch Error:', error);
    } else {
      setLeaveRequests(data);
    }
  };

  const convertTypeToReason = (type) => {
    switch (type) {
      case 'medicalleave':
        return 'Medical Leave';
      case 'ondutyleave':
        return 'On-Duty Leave';
      case 'internship':
        return 'Internship Permission';
      case 'leaveform':
        return 'Leave Form';
      case 'gatepass':
        return 'Gate Pass';
      case 'permission':
        return 'Permission';
      default:
        return '';
    }
  };

  const readableType = convertTypeToReason(type);

  return (
    <main className="requests-content">
      <h2>
        {type ? `${readableType} Requests` : 'All Leave Requests'}
      </h2>
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
                <td>{req.reason}</td>
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