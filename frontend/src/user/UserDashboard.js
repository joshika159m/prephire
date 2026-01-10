import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

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
    setMessage("Resume uploaded");
    setFile(null);
    fetchResumes();
  };

  return (
    <>
      <Navbar role="USER" />

      <div className="container mt-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6>Profile</h6>
            <p className="mb-1 text-muted">
              Email: {localStorage.getItem("email") || "User"}
            </p>
            <p className="mb-0 text-muted">Total Resumes: {resumes.length}</p>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="card shadow-sm">
          <div className="card-body">
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

            <h5>Resume History</h5>

            {resumes.length === 0 ? (
              <div className="alert alert-secondary">
                No resumes uploaded yet.
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
    </>
  );
}

export default UserDashboard;
