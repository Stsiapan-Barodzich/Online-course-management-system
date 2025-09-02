import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";
import EditHomeworkForm from "../HomeworkComponents/EditHomeworkForm.jsx";
import SubmissionList from "../SubmissionComponents/SubmissionList.jsx";
import AddSubmissionForm from "../SubmissionComponents/AddSubmissionForm.jsx";

const BASE_URL = "http://localhost:8000";
const MEDIA_URL = "http://localhost:8000/media/";

function LectureDetail() {
  const { courseId, lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const [lecture, setLecture] = useState(null);
  const [homework, setHomework] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHomework, setEditHomework] = useState(null);
  const [openSubmissions, setOpenSubmissions] = useState(null);
  const [openAddSubmission, setOpenAddSubmission] = useState(null);
  const [showMySubmissions, setShowMySubmissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  useEffect(() => {
    if (!authTokens?.access || !lectureId) return;

    const loadLectureAndHomework = async () => {
      try {
        setLoading(true);
        setError(null);
        const resLecture = await axios.get(
          `${BASE_URL}/api/v1/lectures/${lectureId}/`,
          { headers }
        );
        setLecture(resLecture.data);

        // Проверяем наличие домашнего задания
        try {
          const resHomework = await axios.get(
            `${BASE_URL}/api/v1/homework/?lecture=${lectureId}`,
            { headers }
          );
          setHomework(resHomework.data.length > 0 ? resHomework.data[0] : null);
        } catch (err) {
          if (err.response?.status !== 404) {
            setError("Failed to load homework");
            console.error(err);
          }
        }
      } catch (err) {
        setError("Failed to load lecture");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLectureAndHomework();
  }, [authTokens, lectureId]);

  const handleDownload = async (filePath, fileName = "presentation.pdf") => {
    try {
      const fileUrl = filePath.startsWith("http")
        ? filePath
        : `${MEDIA_URL}${filePath.replace(/^\/+/, "")}`;
      const response = await axios.get(fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download presentation. Check console for details.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this homework?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/homework/${homework.id}/`, { headers });
      setHomework(null);
    } catch (err) {
      setError("Failed to delete homework");
      console.error(err);
    }
  };

  const handleEdit = () => {
    setEditHomework(homework);
    setShowAddForm(false);
  };

  const handleHomeworkAdded = (hw) => {
    if (hw.lecture === parseInt(lectureId)) {
      setHomework(hw);
    }
    setShowAddForm(false);
  };

  const handleHomeworkUpdated = (updated) => {
    setHomework(updated);
    setEditHomework(null);
  };

  const handleSubmissionAdded = () => {
    setOpenAddSubmission(null);
  };

  if (!lecture) return <div className="loading"><span className="spinner"></span>Loading lecture...</div>;

  return (
    <div className="lecture-detail-container">
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="btn-back-prev"
      >
        To Previous
      </button>
      <h2 className="form-title">Lecture: {lecture.topic}</h2>
      {lecture.presentation ? (
        <button
          onClick={() =>
            handleDownload(
              lecture.presentation,
              lecture.presentation.split("/").pop() || "presentation.pdf"
            )
          }
          className="btn btn-primary btn-small"
        >
          Download Presentation
        </button>
      ) : (
        <p className="no-items">No presentation available</p>
      )}
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Loading...
        </div>
      )}
      {user?.role === "TEACHER" && !showAddForm && !editHomework && !homework && (
        <div className="form-actions">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-small"
          >
            Add Homework
          </button>
        </div>
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
      <h3 className="section-title">Homework</h3>
      {!homework ? (
        <p className="no-items">No homework assigned</p>
      ) : (
        <div className="item">
          <div className="item-content">
            <div className="item-info">
              <span className="item-text">{homework.text}</span>
              <div>{homework.description}</div>
            </div>
            {user?.role === "TEACHER" && (
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
                <button
                  className="btn btn-warning btn-small"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="btn btn-success btn-small"
                  onClick={() =>
                    setOpenSubmissions(openSubmissions === homework.id ? null : homework.id)
                  }
                >
                  {openSubmissions === homework.id ? "Hide Submissions" : "Submissions"}
                </button>
              </div>
            )}
            {user?.role === "STUDENT" && (
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
                <button
                  className="btn btn-primary btn-small"
                  onClick={() =>
                    setOpenAddSubmission(openAddSubmission === homework.id ? null : homework.id)
                  }
                >
                  {openAddSubmission === homework.id ? "Cancel Submission" : "Add Submission"}
                </button>
                <button
                  className="btn btn-info btn-small"
                  onClick={() =>
                    setShowMySubmissions(showMySubmissions === homework.id ? null : homework.id)
                  }
                >
                  {showMySubmissions === homework.id ? "Hide My Submissions" : "My Submissions"}
                </button>
              </div>
            )}
            <div className="sub-content">
              {openSubmissions === homework.id && <SubmissionList homeworkId={homework.id} />}
              {openAddSubmission === homework.id && (
                <AddSubmissionForm
                  homeworkId={homework.id}
                  onSubmissionAdded={() => handleSubmissionAdded()}
                />
              )}
              {showMySubmissions === homework.id && <SubmissionList homeworkId={homework.id} studentOnly />}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LectureDetail;