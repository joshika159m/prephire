import { useEffect, useState } from "react";
import axios from "../api/axios";

function UserDashboard() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const statusColor = {
    PENDING: "bg-warning text-dark",
    REVIEWED: "bg-success",
  };

  const decisionColor = {
    APPROVED: "bg-success",
    REJECTED: "bg-danger",
  };

  const fetchResumes = async () => {
    const res = await axios.get("/resume/my");
    setResumes(res.data);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post("/resume/upload", formData);
      setMessage("Resume uploaded successfully");
      setFile(null);
      fetchResumes();
    } catch {
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold">Profile</h6>
            <p className="mb-1 text-muted">
              Email: {localStorage.getItem("email")}
            </p>
            <p className="mb-0 text-muted">Total Resumes: {resumes.length}</p>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleUpload} className="row g-2">
              <div className="col-md-9">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Resume History</h5>

            {resumes.length === 0 ? (
              <div className="alert alert-secondary">
                No resumes uploaded yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>File</th>
                      <th>Status</th>
                      <th>Decision</th>
                      <th>Feedback</th>
                      <th>Uploaded</th>
                      <th>Reviewed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((r) => (
                      <tr key={r.id}>
                        <td>{r.filename}</td>

                        <td>
                          <span className={`badge ${statusColor[r.status]}`}>
                            {r.status}
                          </span>
                        </td>

                        <td>
                          {r.decision ? (
                            <span
                              className={`badge ${decisionColor[r.decision]}`}
                            >
                              {r.decision}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="text-muted">
                          {r.feedback || "No feedback yet"}
                        </td>

                        <td>{new Date(r.uploaded_at).toLocaleString()}</td>

                        <td>
                          {r.status === "REVIEWED" && r.reviewed_at
                            ? new Date(r.reviewed_at).toLocaleString()
                            : "Not reviewed"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
