import { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

function EditLectureForm({ lecture, onClose, onUpdate }) {
  const { authTokens } = useAuth();
  const [topic, setTopic] = useState(lecture.topic);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveLecture = async () => {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("topic", topic);
    if (file) formData.append("presentation", file);

    try {
      const res = await axios.put(`/api/v1/lectures/${lecture.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Edit Lecture</h3>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Saving lecture...
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); saveLecture(); }} className="form">
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
            onChange={(e) => setFile(e.target.files[0])}
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

export default EditLectureForm;