import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";
import EditHomeworkForm from "../HomeworkComponents/EditHomeworkForm.jsx";

const BASE_URL = "http://localhost:8000";

function LectureDetail() {
  const { lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const [lecture, setLecture] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHomework, setEditHomework] = useState(null);

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  useEffect(() => {
    if (!authTokens?.access || !lectureId) return;

    const loadLectureAndHomework = async () => {
      try {
        const resLecture = await axios.get(
          `${BASE_URL}/api/v1/lectures/${lectureId}/`,
          { headers }
        );
        setLecture(resLecture.data);

        const resHomework = await axios.get(
          `${BASE_URL}/api/v1/homework/?lecture=${lectureId}`,
          { headers }
        );
        setHomeworks(resHomework.data);
      } catch (err) {
        console.error(err);
        alert("Error while loading homeworks");
      }
    };

    loadLectureAndHomework();
  }, [authTokens, lectureId]);

  // Удаление домашки
  const handleDelete = async (hwId) => {
    if (!window.confirm("Delete homework?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/homework/${hwId}/`, { headers });
      setHomeworks((prev) => prev.filter((hw) => hw.id !== hwId));
    } catch (err) {
      console.error(err);
      alert("Error while deleting homework");
    }
  };

  const handleEdit = (hw) => {
    setEditHomework(hw);
    setShowAddForm(false);
  };

  const handleHomeworkAdded = (hw) => {
    if (hw.lecture === parseInt(lectureId)) {
      setHomeworks((prev) => [...prev, hw]);
    }
    setShowAddForm(false);
  };

  const handleHomeworkUpdated = (updated) => {
    setHomeworks((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
    setEditHomework(null);
  };

  if (!lecture) return <div>Loading lecture...</div>;

  return (
    <div>
      <h2>Lecture: {lecture.topic}</h2>

      {user?.role === "TEACHER" && !showAddForm && !editHomework && (
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          Add Homework
        </button>
      )}

      {showAddForm && (
        <AddHomeworkForm
          lectureId={lectureId}
          onHomeworkAdded={handleHomeworkAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editHomework && (
        <EditHomeworkForm
          homework={editHomework}
          onClose={() => setEditHomework(null)}
          onUpdate={handleHomeworkUpdated}
        />
      )}

      <h3>Homeworks</h3>
      {homeworks.length === 0 ? (
        <p>No homework yet</p>
      ) : (
        <ul>
          {homeworks.map((hw) => (
            <li key={hw.id} className="flex justify-between items-center mb-2">
              <span>{hw.text}</span>
              {user?.role === "TEACHER" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(hw)}
                    className="bg-yellow-500 text-white px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hw.id)}
                    className="bg-red-600 text-white px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LectureDetail;
