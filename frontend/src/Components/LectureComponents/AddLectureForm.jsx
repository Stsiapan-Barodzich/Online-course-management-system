import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Contexts/AuthContext"; 

const BASE_URL = "http://localhost:8000/api/v1";

const AddLectureForm = ({ onLectureAdded }) => {
  const { courseId } = useParams();
  const { authTokens } = useAuth();

  const [topic, setTopic] = useState("");
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await axios.post(`${BASE_URL}/lectures/`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTopic("");
      setPresentation(null);
      if (onLectureAdded) onLectureAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow">
      <h3 className="text-lg font-semibold">Add Lecture</h3>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Presentation (optional)</label>
        <input
          type="file"
          onChange={(e) => setPresentation(e.target.files[0])}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Lecture"}
      </button>
    </form>
  );
};

export default AddLectureForm;
