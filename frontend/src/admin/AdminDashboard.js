import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusColor = {
    PENDING: "bg-warning text-dark",
    REVIEWED: "bg-success",
  };

  const decisionColor = {
    APPROVED: "bg-success",
    REJECTED: "bg-danger",
  };

  const fetchResumes = async (pageNumber = 1) => {
    const res = await axios.get(`/resume/all?page=${pageNumber}&limit=5`);
    setResumes(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchResumes(page);
  }, [page]);

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

  // ✅ FIXED: no fake reviewed_at
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

    // 🔥 REFRESH FROM BACKEND (SINGLE SOURCE OF TRUTH)
    fetchResumes(page);

    setReviewData((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <>
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
                <thead className="table-light">
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

                            {r.reviewed_at && (
                              <div className="text-muted small mt-1">
                                Reviewed on{" "}
                                {new Date(r.reviewed_at).toLocaleString()}
                              </div>
                            )}
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
            </div>

            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>

            {filteredResumes.length === 0 && (
              <div className="alert alert-secondary">No resumes found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
