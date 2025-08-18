import React, { useState } from "react";
import axios from "axios";

const AddGradeForm = ({ submissionId, onGradeAdded }) => {
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!score) {
      setError("Score is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/v1/grades/", {
        score: Number(score),
        comment,
        submission: submissionId,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setScore("");
      setComment("");
      onGradeAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Grade</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Score:</label>
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Grade"}
      </button>
    </form>
  );
};

export default AddGradeForm;
