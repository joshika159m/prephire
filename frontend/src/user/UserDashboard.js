import { useEffect, useState } from "react";
import axios from "../api/axios";

function UserDashboard() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState("");

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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const statusLabel = {
    PENDING: "Pending",
    REVIEWED: "Reviewed",
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h3>User Dashboard</h3>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <form onSubmit={handleUpload} className="mt-4">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn btn-primary mt-2">Upload Resume</button>
      </form>

      <h5 className="mt-5">Resume History</h5>

      <table className="table table-bordered mt-3">
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
              <td>{statusLabel[r.status]}</td>
              <td>{r.decision || "-"}</td>
              <td>{r.feedback || "-"}</td>
              <td>{new Date(r.uploaded_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
