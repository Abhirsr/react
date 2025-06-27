import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./StaffMedicalRequests.css";

const StaffMedicalRequests = ({ role }) => {
  const [requests, setRequests] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user email
  useEffect(() => {
    const getUserEmail = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Login required");
        return;
      }

      console.log("📧 Logged in as:", user.email);
      setUserEmail(user.email);
    };

    getUserEmail();
  }, []);

  // Fetch and filter medical leave requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!userEmail || !role) return;

      console.log("👤 Role:", role);
      console.log("📧 User Email:", userEmail);

      setLoading(true);

      let query = supabase
        .from("staff_medical_leave_requests")
        .select("*")
        //.eq("type", "medicalleave")
        .order("submitted_at", { ascending: false });

      if (role !== "faculty" && role !== "hod") {
        query = query.eq("user_email", userEmail);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error fetching requests:", error.message);
      } else {
        console.log("✅ Fetched requests:", data);
        setRequests(data);
      }

      setLoading(false);
    };

    fetchRequests();
  }, [userEmail, role]);

  const handleViewImage = async (urlOrPath) => {
    if (!urlOrPath) return alert("No document uploaded.");

    if (urlOrPath.startsWith("http")) {
      setPreviewUrl(urlOrPath);
      setIsModalOpen(true);
      return;
    }

    const { data, error } = supabase.storage
      .from("medicalcertificate")
      .getPublicUrl(urlOrPath);

    if (error) {
      console.error("Error fetching image URL:", error);
      alert("Failed to fetch document preview.");
      return;
    }

    setPreviewUrl(data.publicUrl);
    setIsModalOpen(true);
  };

  const handleForwardToHOD = async (request) => {
    try {
      const res = await fetch("http://localhost:5050/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyEmail: request.faculty_email,
          studentName: request.name,
          regNo: request.reg_no,
          from: request.from_date,
          to: request.to_date,
          submittedAt: request.submitted_at,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);

        await supabase
          .from("staff_medical_leave_requests")
          .update({ status: "forwarded" })
          .eq("id", request.id);

        setRequests((prev) =>
          prev.map((r) =>
            r.id === request.id ? { ...r, status: "forwarded" } : r
          )
        );
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Forward error:", err);
      alert("Failed to forward the request.");
    }
  };

  const handleApproval = async (request, newStatus) => {
    try {
      await supabase
        .from("staff_medical_leave_requests")
        .update({ status: newStatus })
        .eq("id", request.id);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, status: newStatus } : r
        )
      );

      alert(`Request ${newStatus}`);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to update status.");
    }
  };

  const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="staff-medical-container">
      <h2>Medical Leave Requests</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No medical requests found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg. No</th>
                <th>Faculty Email</th>
                <th>From</th>
                <th>To</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Document</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.name}</td>
                  <td>{request.reg_no}</td>
                  <td>{request.faculty_email}</td>
                  <td>{request.from_date}</td>
                  <td>{request.to_date}</td>
                  <td>{new Date(request.submitted_at).toLocaleString()}</td>
                  <td>{request.status}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewImage(request.medical_doc_path)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    {role === "faculty" && (
                      <button
                        className="forward-button"
                        onClick={() => handleForwardToHOD(request)}
                        disabled={request.status === "forwarded"}
                      >
                        {request.status === "forwarded"
                          ? "Forwarded"
                          : "Forward to HOD"}
                      </button>
                    )}
                    {role === "hod" && request.status === "forwarded" && (
                      <>
                        <button
                          className="approve-button"
                          onClick={() => handleApproval(request, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => handleApproval(request, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for preview */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {isPdf(previewUrl) ? (
              <iframe
                src={previewUrl}
                width="100%"
                height="500px"
                title="PDF Preview"
              />
            ) : (
              <img src={previewUrl} alt="Medical Certificate" />
            )}
            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMedicalRequests;