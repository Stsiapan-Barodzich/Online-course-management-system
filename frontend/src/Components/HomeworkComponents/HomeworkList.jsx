import { useState, useEffect } from "react";
import axios from "axios";
import EditHomeworkForm from "./EditHomeworkForm.jsx";

function HomeworkList({ courseId, role }) {
  const [homeworks, setHomeworks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/homework/?course=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setHomeworks(res.data));
  }, [courseId]);

  const deleteHomework = async (id) => {
    const token = localStorage.getItem("access");
    await axios.delete(`/api/v1/homework/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHomeworks(homeworks.filter(h => h.id !== id));
  };

  return (
    <div>
      <h2>Homework List</h2>
      <ul>
        {homeworks.map(h => (
          <li key={h.id}>
            {h.text.substring(0, 50)}...
            {role === "TEACHER" && (
              <>
                <button onClick={() => setEditingId(h.id)}>Edit</button>
                <button onClick={() => deleteHomework(h.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {editingId && (
        <EditHomeworkForm
          homework={homeworks.find(h => h.id === editingId)}
          onClose={() => setEditingId(null)}
          onUpdate={(updated) => {
            setHomeworks(homeworks.map(h => h.id === updated.id ? updated : h));
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

export default HomeworkList;
