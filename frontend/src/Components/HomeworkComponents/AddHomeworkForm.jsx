// src/Components/Homework/AddHomeworkForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000/api/v1";

function AddHomeworkForm({ courseId, lectureId, editHomework = null, onHomeworkAdded, onCancel }) {
  const { authTokens, user } = useAuth();
  const [text, setText] = useState(editHomework ? editHomework.text : "");
  const [dueDate, setDueDate] = useState(editHomework ? editHomework.due_date : "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!lectureId) {
      setError("Lecture ID is required");
      return;
    }

    try {
      let res;
      if (editHomework) {
        // редактирование
        res = await axios.put(
          `${BASE_URL}/homework/${editHomework.id}/`,
          { text, due_date: dueDate, lecture: lectureId },
          { headers }
        );
        setSuccess("Homework updated ✅");
      } else {
        // создание
        res = await axios.post(
          `${BASE_URL}/homework/`,
          { text, due_date: dueDate, lecture: lectureId },
          { headers }
        );
        setSuccess("Homework added ✅");
      }

      onHomeworkAdded && onHomeworkAdded(res.data);
      setText("");
      setDueDate("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("Unauthorized ❌");
      else setError("Something went wrong ❌");
    }
  };

  // Рендерим только для TEACHER
  if (user?.role !== "TEACHER") return null;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {editHomework ? "Edit Homework" : "Add Homework"}
      </h2>
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Homework Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editHomework ? "Save" : "Add"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
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
