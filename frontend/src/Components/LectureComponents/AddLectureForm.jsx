import React, { useState } from "react";
import axios from "axios";

const AddLectureForm = ({ courseId, onLectureAdded }) => {
  const [topic, setTopic] = useState("");
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

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
      const res = await axios.post("/api/v1/lectures/", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTopic("");
      setPresentation(null);
      onLectureAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Lecture</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Topic:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Presentation (optional):</label>
        <input
          type="file"
          onChange={(e) => setPresentation(e.target.files[0])}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Lecture"}
      </button>
    </form>
  );
};

export default AddLectureForm;
