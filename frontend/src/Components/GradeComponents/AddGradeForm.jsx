import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

const AddGradeForm = ({ submissionId, onGradeAdded }) => {
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { authTokens, user } = useAuth();

  if (!user || user.role !== "TEACHER") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!score) {
      setError("Score is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/grades/`,
        {
          score: Number(score),
          comment,
          submission: Number(submissionId),
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      setScore("");
      setComment("");
      if (onGradeAdded) onGradeAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Add Grade</h3>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Saving grade...
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Score</label>
          <input
            type="number"
            min="0"
            max="100"
            className="form-input"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Comment (optional)</label>
          <textarea
            className="form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            disabled={loading}
            rows="4"
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success btn-small"
          >
            {loading ? "Saving..." : "Add Grade"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGradeForm;