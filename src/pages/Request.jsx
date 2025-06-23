import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Request.css';

const Request = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('requests').select('*').order('submitted_at', { ascending: false });
    if (error) {
      console.error('Fetch Error:', error);
    } else {
      setLeaveRequests(data);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
      <main className="requests-content">
        <h2>Leave Requests</h2>
        <table className="requests-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg No</th>
              <th>Faculty Email</th>
              <th>Reason</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.reg_no}</td>
                <td>{req.faculty_email}</td>
                <td>{req.reason}</td>
                <td>{req.from_date}</td>
                <td>{req.to_date}</td>
                <td>{new Date(req.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
  );
};

export default Request;