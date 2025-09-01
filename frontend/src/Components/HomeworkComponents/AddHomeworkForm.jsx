import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000/api/v1";

function AddHomeworkForm({ courseId, lectureId, editHomework = null, onHomeworkAdded, onCancel }) {
  const { authTokens, user } = useAuth();
  const [text, setText] = useState(editHomework ? editHomework.text : "");
  const [description, setDescription] = useState(editHomework && editHomework.description ? editHomework.description : "");
  const [deadline, setDeadline] = useState(
    editHomework && editHomework.deadline ? new Date(editHomework.deadline).toISOString().split("T")[0] : getDefaultDeadline()
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function getDefaultDeadline() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  }

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!lectureId) {
      setError("Lecture ID is required");
      setLoading(false);
      return;
    }

    try {
      let res;
      if (editHomework) {
        res = await axios.put(
          `${BASE_URL}/homework/${editHomework.id}/`,
          { text, description, deadline, lecture: lectureId },
          { headers }
        );
        setSuccess("Homework updated successfully");
      } else {
        res = await axios.post(
          `${BASE_URL}/homework/`,
          { text, description, deadline, lecture: lectureId },
          { headers }
        );
        setSuccess("Homework added successfully");
      }

      onHomeworkAdded && onHomeworkAdded(res.data);
      setText("");
      setDescription("");
      setDeadline(getDefaultDeadline());
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("Unauthorized");
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "TEACHER") return null;

  return (
    <div className="form-container">
      <h2 className="form-title">{editHomework ? "Edit Homework" : "Add Homework"}</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Saving homework...
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Homework Text</label>
          <textarea
            className="form-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
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
            required
            disabled={loading}
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-small"
          >
            {editHomework ? "Save" : "Add"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-danger btn-small"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddHomeworkForm;