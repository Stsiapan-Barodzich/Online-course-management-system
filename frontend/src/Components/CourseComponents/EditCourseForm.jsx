import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

function EditCourseForm() {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Добавляем состояние для description
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authTokens } = useAuth();

  const loadCourse = async () => {
    const token = authTokens?.access;
    if (!token) {
      setError("Please login first");
      navigate("/login/");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/v1/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle(res.data.title);
      setDescription(res.data.description || ""); // Загружаем description
    } catch (err) {
      setError("Failed to load course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = authTokens?.access;
    try {
      setLoading(true);
      setError(null);
      await axios.put(
        `http://localhost:8000/api/v1/courses/${courseId}/`,
        { title, description }, // Добавляем description в тело запроса
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/courses");
    } catch (err) {
      console.error("Error updating course:", err.response || err);
      let errorMessage = "Failed to update course";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Unauthorized: Please log in again.";
        } else if (err.response.status === 403) {
          errorMessage = "Forbidden: You do not have permission to edit this course.";
        } else if (err.response.status === 404) {
          errorMessage = `Course with ID ${courseId} not found.`;
        } else if (err.response.data) {
          errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Course</h2>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Loading course...
        </div>
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
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
            onClick={() => navigate("/courses")}
            className="btn btn-danger btn-small"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourseForm;