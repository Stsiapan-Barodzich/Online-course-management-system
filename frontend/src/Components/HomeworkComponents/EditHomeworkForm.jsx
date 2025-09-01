import { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

function EditHomeworkForm({ homework, onClose, onUpdate }) {
  const { authTokens, user } = useAuth();
  const [text, setText] = useState(homework.text || "");
  const [description, setDescription] = useState(homework.description || "");
  const [deadline, setDeadline] = useState(
    homework.deadline ? new Date(homework.deadline).toISOString().split("T")[0] : getDefaultDeadline()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getDefaultDeadline() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  }

  const saveHomework = async () => {
    if (!authTokens?.access) {
      setError("No access token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/homework/${homework.id}/`,
        { text, description, deadline },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save homework");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "TEACHER") return null;

  return (
    <div className="form-container">
      <h3 className="form-title">Edit Homework</h3>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Saving homework...
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); saveHomework(); }} className="form">
        <div className="form-group">
          <label className="form-label">Homework Text</label>
          <textarea
            className="form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            type="date"
            className="form-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            disabled={loading}
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
            onClick={onClose}
            disabled={loading}
            className="btn btn-danger btn-small"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditHomeworkForm;