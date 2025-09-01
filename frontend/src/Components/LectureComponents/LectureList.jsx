import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import EditLectureForm from "./EditLectureForm.jsx";

function LectureList({ courseId, role }) {
  const { authTokens } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLectures = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/v1/lectures/?course=${courseId}`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setLectures(res.data);
      } catch (err) {
        setError("Failed to load lectures");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (authTokens?.access) loadLectures();
  }, [courseId, authTokens]);

  const deleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await axios.delete(`/api/v1/lectures/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setLectures(lectures.filter((l) => l.id !== id));
    } catch (err) {
      setError("Failed to delete lecture");
      console.error(err);
    }
  };

  return (
    <div className="lecture-list-container">
      <h2 className="form-title">Lectures</h2>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Loading lectures...
        </div>
      )}
      {lectures.length === 0 ? (
        <p className="no-items">No lectures available</p>
      ) : (
        <ul className="item-list">
          {lectures.map((l) => (
            <li key={l.id} className="item">
              <span className="item-text">{l.topic}</span>
              {role === "TEACHER" && (
                <div className="item-actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => setEditingId(l.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => deleteLecture(l.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {editingId && (
        <EditLectureForm
          lecture={lectures.find((l) => l.id === editingId)}
          onClose={() => setEditingId(null)}
          onUpdate={(updated) => {
            setLectures(lectures.map((l) => (l.id === updated.id ? updated : l)));
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

export default LectureList;