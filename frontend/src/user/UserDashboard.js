import { useEffect, useState } from "react";
import axios from "../api/axios";

function UserDashboard() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
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
    const res = await axios.get("/resume/my");
    setResumes(res.data);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    await axios.post("/resume/upload", formData);
    setMessage("Resume uploaded successfully");
    setFile(null);
    fetchResumes();
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
            <h4>User Dashboard</h4>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleUpload} className="mb-4">
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button className="btn btn-primary">Upload</button>
            </div>
          </form>

          <h5 className="mb-3">Resume History</h5>

          {resumes.length === 0 ? (
            <div className="alert alert-secondary">
              You haven’t uploaded any resumes yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Status</th>
                    <th>Decision</th>
                    <th>Feedback</th>
                    <th>Uploaded</th>
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
                          "-"
                        )}
                      </td>

                      <td className="text-muted">
                        {r.feedback || "No feedback yet"}
                      </td>

                      <td>{new Date(r.uploaded_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
