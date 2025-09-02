import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddGradeForm from "../GradeComponents/AddGradeForm";
import EditGradeForm from "../GradeComponents/EditGradeForm";

function SubmissionList() {
  const { courseId, lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState({});
  const [showGrade, setShowGrade] = useState({});
  const [showEditForm, setShowEditForm] = useState({});
  const [editContent, setEditContent] = useState({});
  const [editError, setEditError] = useState("");

  const loadSubmissions = async () => {
    if (!authTokens?.access) {
      setError("Please login first");
      navigate("/login/");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `http://localhost:8000/api/v1/submissions/?lecture=${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setSubmissions(res.data);
    } catch (err) {
      setError("Failed to load submissions");
      console.error("Failed to load submissions:", err);
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
          sub.id === submissionId
            ? { ...sub, content: res.data.content, submitted_at: res.data.submitted_at }
            : sub
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
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setSubmissions((prev) => prev.filter((sub) => sub.id !== submissionId));
    } catch (err) {
      setError("Failed to delete submission");
      console.error("Failed to delete submission:", err);
    }
  };

  if (loading)
    return (
      <div className="loading">
        <span className="spinner"></span>Loading submissions...
      </div>
    );

  return (
    <div className="submission-list-container">
      <h2 className="form-title">Submissions</h2>
      {error && <p className="error">{error}</p>}
      {submissions.length === 0 ? (
        <p className="no-items">No submissions yet</p>
      ) : (
        <ul className="item-list">
          {submissions.map((sub) => (
            <li key={sub.id} className="item">
              <div className="item-content">
                <div className="item-info">
                  <strong>Student:</strong> {sub.student?.username || "—"}
                </div>
                <div className="item-info">
                  <strong>Submitted at:</strong>{" "}
                  {new Date(sub.submitted_at).toLocaleString()}
                </div>
                <div className="item-info">
                  <strong>Content:</strong>
                  <div className="item-text">{sub.content}</div>
                </div>
                {/* Display grade for student */}
                {user?.role === "STUDENT" && sub.grade && showGrade[sub.id] && (
                  <div className="grade-info">
                    <strong>Score:</strong> {sub.grade.score ?? "—"} <br />
                    <strong>Comment:</strong> {sub.grade.comment || "—"} <br />
                    <strong>Graded at:</strong>{" "}
                    {new Date(sub.grade.graded_at).toLocaleString()}
                  </div>
                )}
                {/* Display grade for teacher */}
                {user?.role === "TEACHER" && sub.grade && (
                  <div className="grade-info">
                    <strong>Score:</strong> {sub.grade.score ?? "—"} <br />
                    <strong>Comment:</strong> {sub.grade.comment || "—"} <br />
                    <strong>Graded at:</strong>{" "}
                    {new Date(sub.grade.graded_at).toLocaleString()}
                  </div>
                )}
                {user?.role === "STUDENT" && showEditForm[sub.id] && (
                  <div className="edit-form">
                    {editError && <p className="error">{editError}</p>}
                    <textarea
                      className="form-textarea"
                      value={editContent[sub.id] || ""}
                      onChange={(e) =>
                        setEditContent((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="Edit your submission"
                      rows="5"
                    />
                    <div className="form-actions">
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleEditSubmission(sub.id)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
                {user?.role === "TEACHER" && showGradeForm[sub.id] && (
                  <div className="grade-form">
                    {sub.grade ? (
                      <EditGradeForm
                        grade={sub.grade}
                        onGradeUpdated={(grade) => handleGradeAdded(sub.id, grade)}
                      />
                    ) : (
                      <AddGradeForm
                        submissionId={sub.id}
                        onGradeAdded={(grade) => handleGradeAdded(sub.id, grade)}
                      />
                    )}
                  </div>
                )}
              </div>
              <div
                className="item-actions"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  marginTop: "8px",
                  justifyContent: "flex-start",
                }}
              >
                {user?.role === "TEACHER" && (
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() =>
                      setShowGradeForm((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }))
                    }
                  >
                    {sub.grade ? "Edit Grade" : "Grade"}
                  </button>
                )}
                {user?.role === "STUDENT" && sub.student?.id === user.id && (
                  <>
                    <button
                      className="btn btn-primary btn-small"
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
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteSubmission(sub.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                {user?.role === "STUDENT" && sub.grade && (
                  <button
                    className="btn btn-info btn-small"
                    onClick={() =>
                      setShowGrade((prev) => ({
                        ...prev,
                        [sub.id]: !prev[sub.id],
                      }))
                    }
                  >
                    My Grade
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}

export default SubmissionList;