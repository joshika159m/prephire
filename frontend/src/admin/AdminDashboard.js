import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [filter, setFilter] = useState("ALL");
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

  const filteredResumes = resumes.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return r.status === "PENDING";
    if (filter === "APPROVED") return r.decision === "APPROVED";
    if (filter === "REJECTED") return r.decision === "REJECTED";
    return true;
  });

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
      setMessage("Select Approved or Rejected");
      return;
    }

    await axios.patch(`/resume/${id}/review`, {
      decision: data.decision,
      feedback: data.feedback || "",
    });

    setMessage("Review submitted");

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
  };

  return (
    <>
      <Navbar role="ADMIN" />

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="mb-3">Admin Dashboard</h4>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="d-flex gap-3 mb-3">
              <span className="badge bg-warning text-dark">
                Pending: {resumes.filter((r) => r.status === "PENDING").length}
              </span>
              <span className="badge bg-success">
                Approved:{" "}
                {resumes.filter((r) => r.decision === "APPROVED").length}
              </span>
              <span className="badge bg-danger">
                Rejected:{" "}
                {resumes.filter((r) => r.decision === "REJECTED").length}
              </span>
            </div>

            <ul className="nav nav-tabs mb-3">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
                <li className="nav-item" key={f}>
                  <button
                    className={`nav-link ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>

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
                  {filteredResumes.map((r) => (
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
                          <option value="">Decision</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>

                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows="2"
                          disabled={r.status === "REVIEWED"}
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

              {filteredResumes.length === 0 && (
                <div className="alert alert-secondary">No resumes found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
