import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const AddSubmissionForm = ({ homeworkId, onSubmissionAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authTokens, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Submission text required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/submissions/",
        {
          content,
          homework: homeworkId,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      setContent("");
      onSubmissionAdded?.(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error while sending submission");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "STUDENT") return null;

  return (
    <div className="form-container">
      <h3 className="form-title">Send Submission</h3>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Sending submission...
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Submission Content</label>
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your submission here..."
            rows="5"
            disabled={loading}
            required
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-small"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubmissionForm;