import React, { useState } from "react";
import axios from "axios";

const AddSubmissionForm = ({ homeworkId, onSubmissionAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content) {
      setError("Submission content is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/v1/submissions/",
        {
          content,
          homework: homeworkId,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setContent("");
      onSubmissionAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit homework");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit Homework</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your homework here"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default AddSubmissionForm;
