import { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000"; 

function EditLectureForm({ lecture, onClose, onUpdate }) {
  const { authTokens } = useAuth();
  const [topic, setTopic] = useState(lecture.topic);
  const [file, setFile] = useState(null);
  const [currentPresentation, setCurrentPresentation] = useState(lecture.presentation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveLecture = async () => {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("topic", topic);
    if (file) {
      formData.append("presentation", file);
    } else if (!currentPresentation) {
      formData.append("presentation", "");
    }

    try {
      const res = await axios.patch(`${BASE_URL}/api/v1/lectures/${lecture.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error("Error updating lecture:", err.response || err);
      let errorMessage = "Failed to update lecture";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized: Please log in again.";
        } else if (err.response.status === 403) {
          errorMessage = "Forbidden: You do not have permission to edit this lecture.";
        } else if (err.response.status === 404) {
          errorMessage = `Lecture with ID ${lecture.id} not found. Please check the lecture ID or server configuration.`;
        } else if (err.response.data) {
          errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePresentation = () => {
    setCurrentPresentation(null);
    setFile(null);
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
          <label className="form-label">Presentation</label>
          {currentPresentation && !file ? (
            <div className="current-presentation">
              <p>Current file: {currentPresentation.split("/").pop()}</p>
            </div>
          ) : (
            <p>{file ? file.name : "No file selected"}</p>
          )}
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