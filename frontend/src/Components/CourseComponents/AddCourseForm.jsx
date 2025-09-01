import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

const AddCourseForm = ({ onSuccess }) => {
  const { authTokens, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated or not a teacher
  if (!authTokens?.access || user?.role !== "TEACHER") {
    navigate("/login/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Course title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to add course");
      }

      const data = await response.json();
      if (onSuccess) onSuccess(data); // Call onSuccess if provided
      setTitle("");
      setDescription("");
      navigate("/courses/"); // Redirect to CourseList
    } catch (err) {
      setError(err.message);
      console.error("Error adding course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Course</h2>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Adding course...
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
            className="form-textarea"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-small"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;