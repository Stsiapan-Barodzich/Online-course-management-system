import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000/api/v1";

function AddHomeworkForm({ courseId, lectureId, editHomework = null, onHomeworkAdded, onCancel }) {
  const { authTokens, user } = useAuth();
  const [text, setText] = useState(editHomework ? editHomework.text : "");
  const [description, setDescription] = useState(editHomework && editHomework.description ? editHomework.description : "");
  const [deadline, setDeadline] = useState(
    editHomework && editHomework.deadline ? new Date(editHomework.deadline).toISOString().split("T")[0] : getDefaultDeadline()
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Функция для вычисления значения по умолчанию (текущая дата + 7 дней)
  function getDefaultDeadline() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
  }

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
        // Редактирование
        res = await axios.put(
          `${BASE_URL}/homework/${editHomework.id}/`,
          { text, description, deadline, lecture: lectureId },
          { headers }
        );
        setSuccess("Задание обновлено ✅");
      } else {
        // Создание
        res = await axios.post(
          `${BASE_URL}/homework/`,
          { text, description, deadline, lecture: lectureId },
          { headers }
        );
        setSuccess("Задание добавлено ✅");
      }

      onHomeworkAdded && onHomeworkAdded(res.data);
      setText("");
      setDescription("");
      setDeadline(getDefaultDeadline()); // Сбрасываем на значение по умолчанию
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("Unauthorized ❌");
      else setError("Что-то пошло не так ❌");
    }
  };

  // Рендерим только для TEACHER
  if (user?.role !== "TEACHER") return null;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {editHomework ? "Редактировать задание" : "Добавить задание"}
      </h2>
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Текст задания</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Дедлайн</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editHomework ? "Сохранить" : "Добавить"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddHomeworkForm;