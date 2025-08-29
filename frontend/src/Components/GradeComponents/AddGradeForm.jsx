import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

const AddGradeForm = ({ submissionId, onGradeAdded }) => {
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const { authTokens, user } = useAuth();

  if (!user || user.role !== "TEACHER") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!score) {
      setError("Score is required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/grades/`,
        {
          score: Number(score),
          comment,
          submission: Number(submissionId),
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      setScore("");
      setComment("");
      if (onGradeAdded) onGradeAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded-md shadow-sm mb-3">
      <h3 className="text-lg font-semibold mb-2">Add Grade</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-2">
        <label className="block mb-1">Score:</label>
        <input
          type="number"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border p-1 rounded w-full"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Comment (optional):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-1 rounded w-full"
          placeholder="Add a comment"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Saving..." : "Add Grade"}
      </button>
    </form>
  );
};

export default AddGradeForm;
