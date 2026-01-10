import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [message, setMessage] = useState("");

  const statusColor = {
    PENDING: "bg-warning text-dark",
    REVIEWED: "bg-success",
  };

  const decisionColor = {
    APPROVED: "bg-success",
    REJECTED: "bg-danger",
  };

  const fetchResumes = async () => {
    const res = await axios.get("/resume/all");
    setResumes(res.data);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDownload = async (id, filename) => {
    const res = await axios.get(`/resume/download/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const submitReview = async (id) => {
    const data = reviewData[id];

    if (!data || !data.decision) {
      setMessage("Please select Approved or Rejected");
      return;
    }

    try {
      await axios.patch(`/resume/${id}/review`, {
        decision: data.decision,
        feedback: data.feedback || "",
      });

      setMessage("Review submitted successfully");

      setResumes((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "REVIEWED",
                decision: data.decision,
                feedback: data.feedback || "",
              }
            : r
        )
      );

      setReviewData((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch {
      setMessage("Review failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h4>Admin Dashboard</h4>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Review</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.email}</td>

                    <td>
                      <span className={`badge ${statusColor[r.status]}`}>
                        {r.status}
                      </span>
                      {r.decision && (
                        <div className="mt-1">
                          <span
                            className={`badge ${decisionColor[r.decision]}`}
                          >
                            {r.decision}
                          </span>
                        </div>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDownload(r.id, r.filename)}
                      >
                        Download
                      </button>
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm mb-2"
                        disabled={r.status === "REVIEWED"}
                        value={reviewData[r.id]?.decision || ""}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            [r.id]: {
                              ...reviewData[r.id],
                              decision: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Select decision</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <textarea
                        className="form-control form-control-sm mb-2"
                        rows="2"
                        disabled={r.status === "REVIEWED"}
                        placeholder="Feedback"
                        value={reviewData[r.id]?.feedback || ""}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            [r.id]: {
                              ...reviewData[r.id],
                              feedback: e.target.value,
                            },
                          })
                        }
                      />

                      <button
                        className="btn btn-primary btn-sm"
                        disabled={r.status === "REVIEWED"}
                        onClick={() => submitReview(r.id)}
                      >
                        Submit Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {resumes.length === 0 && (
              <div className="alert alert-secondary">
                No resumes submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
