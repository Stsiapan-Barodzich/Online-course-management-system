// src/Components/Homework/AddHomeworkForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddHomeworkForm = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lectureId, setLectureId] = useState("");
  const [lectures, setLectures] = useState([]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Загружаем список лекций для выбора
  useEffect(() => {
    axios
      .get("/api/lectures/")
      .then((res) => setLectures(res.data))
      .catch(() => setError("Не удалось загрузить список лекций"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/homeworks/", {
        topic,
        description,
        due_date: dueDate,
        lecture: lectureId,
      });

      setSuccess("Домашнее задание успешно добавлено ✅");
      setTopic("");
      setDescription("");
      setDueDate("");
      setLectureId("");
    } catch (err) {
      setError("Ошибка при добавлении задания ❌");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Добавить домашнее задание</h2>
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Тема</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Дата сдачи</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Лекция</label>
          <select
            value={lectureId}
            onChange={(e) => setLectureId(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- выберите лекцию --</option>
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.topic}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddHomeworkForm;
