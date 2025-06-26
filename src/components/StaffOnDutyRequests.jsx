import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./StaffOndutyRequests.css";

const StaffOndutyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: allOdRequests, error } = await supabase
        .from("odrequests")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching on duty requests:", error);
        return;
      }
      setRequests(allOdRequests);
    };
    fetchRequests();
  }, []);

  const handleViewImage = async (urlOrPath) => {
    if (!urlOrPath) return alert("No document uploaded.");

    if (urlOrPath.startsWith("http")) {
      setPreviewUrl(urlOrPath);
      setIsModalOpen(true);
      return;
    }

    const { data, error } = supabase.storage
      .from("uploadodproofletter")
      .getPublicUrl(urlOrPath);

    if (error) {
      console.error("Error fetching image URL:", error);
      alert("Failed to fetch document preview.");
      return;
    }

    setPreviewUrl(data.publicUrl);
    setIsModalOpen(true);
  };

  const isPdf = (url) => url.toLowerCase().endsWith(".pdf");

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
                    onClick={() => handleViewImage(request.proof_file_url)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Preview */}
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
              <img src={previewUrl} alt="Proof Document" />
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