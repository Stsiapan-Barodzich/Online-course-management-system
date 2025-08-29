import { useState } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

function EditHomeworkForm({ homework, onClose, onUpdate }) {
  const { authTokens, user } = useAuth();
  const [text, setText] = useState(homework.text || "");
  const [description, setDescription] = useState(homework.description || "");
  const [deadline, setDeadline] = useState(
    homework.deadline ? new Date(homework.deadline).toISOString().split("T")[0] : getDefaultDeadline()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Функция для вычисления значения по умолчанию (текущая дата + 7 дней)
  function getDefaultDeadline() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
  }

  const saveHomework = async () => {
    if (!authTokens?.access) {
      setError("Нет токена доступа");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/homework/${homework.id}/`,
        { text, description, deadline },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      );
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ошибка при сохранении домашнего задания");
    } finally {
      setLoading(false);
    }
  };

  // Только учитель может редактировать
  if (user?.role !== "TEACHER") return null;

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Редактировать задание</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-2">
        <label className="block font-medium mb-1">Текст задания</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium mb-1">Дедлайн</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={saveHomework}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

export default EditHomeworkForm;