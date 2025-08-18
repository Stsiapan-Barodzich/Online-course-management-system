import { useState, useEffect } from "react";
import axios from "axios";
import EditLectureForm from "./EditLectureForm.jsx";

function LectureList({ courseId, role }) {
  const [lectures, setLectures] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/lectures/?course=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setLectures(res.data));
  }, [courseId]);

  const deleteLecture = async (id) => {
    const token = localStorage.getItem("access");
    await axios.delete(`/api/v1/lectures/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLectures(lectures.filter(l => l.id !== id));
  };

  return (
    <div>
      <h2>Lectures</h2>
      <ul>
        {lectures.map(l => (
          <li key={l.id}>
            {l.topic}
            {role === "TEACHER" && (
              <>
                <button onClick={() => setEditingId(l.id)}>Edit</button>
                <button onClick={() => deleteLecture(l.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {editingId && (
        <EditLectureForm
          lecture={lectures.find(l => l.id === editingId)}
          onClose={() => setEditingId(null)}
          onUpdate={(updated) => {
            setLectures(lectures.map(l => l.id === updated.id ? updated : l));
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

export default LectureList;
