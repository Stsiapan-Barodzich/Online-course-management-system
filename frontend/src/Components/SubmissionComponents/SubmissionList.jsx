import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddGradeForm from "../GradeComponents/AddGradeForm";

function SubmissionList() {
  const { courseId, lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeForm, setShowGradeForm] = useState({}); // Хранит, для какой submission показывать форму
  const [showGrade, setShowGrade] = useState({}); // Хранит, для какой submission показывать оценку
  const [showEditForm, setShowEditForm] = useState({}); // Хранит, для какой submission показывать форму редактирования
  const [editContent, setEditContent] = useState({}); // Хранит содержимое для редактирования
  const [editError, setEditError] = useState(""); // Ошибка при редактировании

  const loadSubmissions = async () => {
    if (!authTokens?.access) {
      alert("Please login first");
      navigate("/login/");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/submissions/?lecture=${lectureId}`,
        {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        }
      );
      console.log("Submissions data:", res.data); // Для отладки
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
      alert("Failed to load submissions. Check console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [lectureId]);

  const handleGradeAdded = (submissionId, grade) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, grade } : sub
      )
    );
    setShowGradeForm((prev) => ({ ...prev, [submissionId]: false }));
  };

  const handleEditSubmission = async (submissionId) => {
    if (!editContent[submissionId]) {
      setEditError("Content is required");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/submissions/${submissionId}/`,
        {
          content: editContent[submissionId],
          lecture: lectureId,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, content: res.data.content, submitted_at: res.data.submitted_at } : sub
        )
      );
      setShowEditForm((prev) => ({ ...prev, [submissionId]: false }));
      setEditContent((prev) => ({ ...prev, [submissionId]: "" }));
      setEditError("");
    } catch (err) {
      setEditError(err.response?.data?.detail || "Failed to update submission");
      console.error("Error updating submission:", err.response?.data);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/submissions/${submissionId}/`,
        {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        }
      );
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    } catch (err) {
      console.error("Failed to delete submission:", err);
      alert("Failed to delete submission. Check console.");
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div>
      <h2>
        Submissions (Course {courseId}, Lecture {lectureId})
      </h2>

      {submissions.length === 0 ? (
        <p>No submissions yet</p>
      ) : (
        <ul>
          {submissions.map((sub) => (
            <li key={sub.id} style={{ marginBottom: "10px" }}>
              <strong>Student:</strong> {sub.student?.username || "—"} <br />
              <strong>Submitted at:</strong>{" "}
              {new Date(sub.submitted_at).toLocaleString()} <br />
              <strong>Content:</strong>
              <div style={{ whiteSpace: "pre-wrap", marginTop: "5px" }}>
                {sub.content}
              </div>

              {/* Кнопка и форма для учителя */}
              {user?.role === "TEACHER" && sub.id && (
                <>
                  <button
                    style={{ marginTop: "5px", marginRight: "5px" }}
                    onClick={() =>
                      setShowGradeForm((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }))
                    }
                  >
                    {showGradeForm[sub.id] ? "Cancel" : "Grade"}
                  </button>
                  {showGradeForm[sub.id] && (
                    <div style={{ marginTop: "10px" }}>
                      <AddGradeForm
                        submissionId={sub.id}
                        onGradeAdded={(grade) => handleGradeAdded(sub.id, grade)}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Кнопки и форма для студента */}
              {user?.role === "STUDENT" && sub.student?.id === user.id && (
                <>
                  <button
                    style={{ marginTop: "5px", marginRight: "5px" }}
                    onClick={() => {
                      setShowEditForm((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }));
                      setEditContent((prev) => ({
                        ...prev,
                        [sub.id]: sub.content,
                      }));
                    }}
                  >
                    {showEditForm[sub.id] ? "Cancel Edit" : "Edit"}
                  </button>
                  <button
                    style={{ marginTop: "5px", marginRight: "5px" }}
                    onClick={() => handleDeleteSubmission(sub.id)}
                  >
                    Delete
                  </button>
                  {showEditForm[sub.id] && (
                    <div style={{ marginTop: "10px" }}>
                      {editError && <p style={{ color: "red" }}>{editError}</p>}
                      <textarea
                        value={editContent[sub.id] || ""}
                        onChange={(e) =>
                          setEditContent((prev) => ({
                            ...prev,
                            [sub.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "5px",
                          marginBottom: "5px",
                        }}
                        placeholder="Edit your submission"
                      />
                      <button
                        style={{
                          backgroundColor: "#2563eb",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "4px",
                        }}
                        onClick={() => handleEditSubmission(sub.id)}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Кнопка для студента показать его оценку */}
              {user?.role === "STUDENT" && sub.grade && (
                <>
                  <button
                    style={{ marginTop: "5px", marginRight: "5px" }}
                    onClick={() =>
                      setShowGrade((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }))
                    }
                  >
                    My Grade
                  </button>
                  {showGrade[sub.id] && (
                    <div style={{ marginTop: "5px", padding: "5px", border: "1px solid #ccc" }}>
                      <strong>Score:</strong> {sub.grade.score ?? "—"} <br />
                      <strong>Comment:</strong> {sub.grade.comment || "—"} <br />
                      <strong>Graded at:</strong>{" "}
                      {new Date(sub.grade.graded_at).toLocaleString()}
                    </div>
                  )}
                </>
              )}

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionList;