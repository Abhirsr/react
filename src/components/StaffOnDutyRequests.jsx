import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./StaffOndutyRequests.css";

const StaffOndutyRequests = ({ role }) => {
  const [requests, setRequests] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("🔍 Starting to fetch OD requests...");

      const { data, error } = await supabase
        .from("odrequests")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase fetch error:", error);
      } else {
        console.log("✅ Fetched OD requests:", data);
        if (!data || data.length === 0) {
          console.warn("⚠️ No OD requests found. Possible reasons:");
          console.warn("- No data in 'odrequests' table");
          console.warn("- RLS (Row-Level Security) is blocking access");
          console.warn("- Wrong column name in .order()");
        }
        setRequests(data || []);
      }
    };

    fetchRequests();
  }, []);

  const handleViewImage = (url) => {
    if (!url) return alert("No document uploaded.");
    setPreviewUrl(url);
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
          .from("odrequests")
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
        .from("odrequests")
        .update({ status: newStatus })
        .eq("id", request.id);

      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
      );

      alert(`Request ${newStatus}`);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to update status.");
    }
  };

  const isPdf = (url) => url && url.toLowerCase().endsWith(".pdf");

  return (
    <div className="staff-onduty-container">
      <h2>On Duty Requests</h2>
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
                    onClick={() => handleViewImage(request.od_doc_path)}
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
              <img src={previewUrl} alt="OD Proof Document" />
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

export default StaffOndutyRequests;
