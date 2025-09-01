import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

function EditCourseForm() {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
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
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/courses");
    } catch (err) {
      setError("Failed to update course");
      console.error(err);
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