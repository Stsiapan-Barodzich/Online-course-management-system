import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000/api/v1";

const AddLectureForm = ({ onLectureAdded }) => {
  const { courseId } = useParams();
  const { authTokens } = useAuth();
  const [topic, setTopic] = useState("");
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!topic) {
      setError("Topic is required");
      return;
    }

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("course", courseId);
    if (presentation) formData.append("presentation", presentation);

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/lectures/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTopic("");
      setPresentation(null);
      if (onLectureAdded) onLectureAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Add Lecture</h3>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Saving lecture...
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Topic</label>
          <input
            type="text"
            className="form-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Presentation (optional)</label>
          <input
            type="file"
            className="form-file"
            onChange={(e) => setPresentation(e.target.files[0])}
            disabled={loading}
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-small"
          >
            {loading ? "Saving..." : "Add Lecture"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLectureForm;