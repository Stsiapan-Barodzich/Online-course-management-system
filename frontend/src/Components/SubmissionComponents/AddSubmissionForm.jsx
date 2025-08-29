import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const AddSubmissionForm = ({ homeworkId, onSubmissionAdded }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { authTokens, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Submission text required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/submissions/",
        {
          content,
          homework: homeworkId,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      setContent("");
      onSubmissionAdded?.(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error while sending submission");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "STUDENT") return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-md bg-white space-y-3"
    >
      <h3 className="text-lg font-semibold">Send Submission</h3>

      {error && <p className="text-red-500">{error}</p>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your submission here..."
        required
        className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        rows={5}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default AddSubmissionForm;