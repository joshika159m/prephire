import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminDashboard() {
  const [resumes, setResumes] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [message, setMessage] = useState("");

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

      // 🔴 REMOVE THIS LINE TEMPORARILY
      // fetchResumes();

      // Instead update UI optimistically
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

      // Clear only this row’s state
      setReviewData((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      setMessage("Review failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Admin Dashboard</h3>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-bordered">
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
              <td>{r.status}</td>

              <td>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleDownload(r.id, r.filename)}
                >
                  Download
                </button>
              </td>

              <td>
                <select
                  className="form-select mb-2"
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
                  <option value="">-- Select decision --</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                <textarea
                  className="form-control mb-2"
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
                  className="btn btn-primary"
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
  );
}

export default AdminDashboard;
