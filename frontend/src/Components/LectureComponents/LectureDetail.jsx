import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";
import EditHomeworkForm from "../HomeworkComponents/EditHomeworkForm.jsx";
import SubmissionList from "../SubmissionComponents/SubmissionList.jsx";
import AddSubmissionForm from "../SubmissionComponents/AddSubmissionForm.jsx";

const BASE_URL = "http://localhost:8000";

function LectureDetail() {
  const { lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const [lecture, setLecture] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHomework, setEditHomework] = useState(null);
  const [openSubmissions, setOpenSubmissions] = useState(null); 
  const [openAddSubmission, setOpenAddSubmission] = useState(null); 
  const [showMySubmissions, setShowMySubmissions] = useState(null); // homework.id для my submissions студента

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
        alert("Ошибка при загрузке лекции или заданий");
      }
    };

    loadLectureAndHomework();
  }, [authTokens, lectureId]);

  const handleDelete = async (hwId) => {
    if (!window.confirm("Удалить задание?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/homework/${hwId}/`, { headers });
      setHomeworks((prev) => prev.filter((hw) => hw.id !== hwId));
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении задания");
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

  const handleSubmissionAdded = (submission, homeworkId) => {
    setOpenAddSubmission(null);
  };

  if (!lecture) return <div>Загрузка лекции...</div>;

  return (
    <div>
      <h2>Lecture: {lecture.topic}</h2>

      {/* Teacher: Add Homework */}
      {user?.role === "TEACHER" && !showAddForm && !editHomework && (
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4"
        >
          Add homework
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
        <p>There are no homeworks</p>
      ) : (
        <ul>
          {homeworks.map((hw) => (
            <li key={hw.id} className="flex flex-col mb-2 border p-2 rounded">
              <div className="flex justify-between items-center">
                <span>{hw.text}</span>
                <div className="flex gap-2">
                  {/* Teacher buttons */}
                  {user?.role === "TEACHER" && (
                    <>
                      <button
                        className="bg-yellow-600 text-white px-2 rounded"
                        onClick={() => handleEdit(hw)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 rounded"
                        onClick={() => handleDelete(hw.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-green-600 text-white px-2 rounded"
                        onClick={() =>
                          setOpenSubmissions(openSubmissions === hw.id ? null : hw.id)
                        }
                      >
                        Submissions
                      </button>
                    </>
                  )}

                  {/* Student buttons */}
                  {user?.role === "STUDENT" && (
                    <>
                      <button
                        className="bg-blue-600 text-white px-2 rounded"
                        onClick={() =>
                          setOpenAddSubmission(openAddSubmission === hw.id ? null : hw.id)
                        }
                      >
                        Add Submission
                      </button>
                      <button
                        className="bg-purple-600 text-white px-2 rounded"
                        onClick={() =>
                          setShowMySubmissions(showMySubmissions === hw.id ? null : hw.id)
                        }
                      >
                        My Submissions
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Teacher: Submissions list */}
              {openSubmissions === hw.id && <SubmissionList homeworkId={hw.id} />}

              {/* Student: Add submission form */}
              {openAddSubmission === hw.id && (
                <AddSubmissionForm
                  homeworkId={hw.id}
                  onSubmissionAdded={(submission) => handleSubmissionAdded(submission, hw.id)}
                />
              )}

              {/* Student: My submissions list */}
              {showMySubmissions === hw.id && <SubmissionList homeworkId={hw.id} studentOnly />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LectureDetail;
