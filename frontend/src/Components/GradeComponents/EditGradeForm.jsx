import { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

function EditGradeForm({ grade, onGradeUpdated }) {
  const { authTokens } = useAuth();
  const [score, setScore] = useState(grade?.score || "");
  const [comment, setComment] = useState(grade?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!grade?.id) {
      setError("No grade ID provided. Cannot update grade.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/grades/${grade.id}/`,
        { score: score || null, comment: comment || null },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      onGradeUpdated(res.data);
    } catch (err) {
      console.error("Error updating grade:", err.response || err);
      let errorMessage = "Failed to update grade";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized: Please log in again.";
        } else if (err.response.status === 403) {
          errorMessage = "Forbidden: You do not have permission to edit this grade.";
        } else if (err.response.status === 404) {
          errorMessage = `Grade with ID ${grade.id} not found.`;
        } else if (err.response.data) {
          errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Edit Grade</h3>
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
            className="form-input"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            disabled={loading}
            placeholder="Enter score (optional)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Comment</label>
          <textarea
            className="form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            placeholder="Enter comment (optional)"
            rows="4"
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-small"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => onGradeUpdated(grade)} 
            className="btn btn-danger btn-small"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      
    </div>
  );
}

export default EditGradeForm;