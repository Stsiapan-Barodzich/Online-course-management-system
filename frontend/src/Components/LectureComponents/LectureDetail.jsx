import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

function LectureDetail() {
  const { courseId, lectureId } = useParams();
  const { authTokens, user } = useAuth();
  const [lecture, setLecture] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authTokens?.access || !lectureId) return;

    const loadLecture = async () => {
      try {
        // Получаем лекцию
        const res = await axios.get(
          `http://localhost:8000/api/v1/lectures/${lectureId}/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } }
        );
        setLecture(res.data);

        // Если API возвращает только course id, получаем название курса отдельно
        if (res.data.course && typeof res.data.course === "number") {
          const courseRes = await axios.get(
            `http://localhost:8000/api/v1/courses/${res.data.course}/`,
            { headers: { Authorization: `Bearer ${authTokens.access}` } }
          );
          setCourseTitle(courseRes.data.title);
        } else if (res.data.course?.title) {
          setCourseTitle(res.data.course.title);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load lecture or course");
        navigate(`/courses/${courseId}`);
      }
    };

    loadLecture();
  }, [authTokens, lectureId, courseId, navigate]);

  if (!lecture) return <div>Loading lecture...</div>;

  return (
    <div>
      <h2>Lecture: {lecture.topic}</h2>
      <p>Course: {courseTitle}</p>

      {lecture.presentation && (
        <a href={lecture.presentation} target="_blank" rel="noreferrer">
          Download Presentation
        </a>
      )}

      {user?.role === "TEACHER" && (
        <button onClick={() => navigate(`/courses/${courseId}/lectures/${lectureId}/edit`)}>
          Edit Lecture
        </button>
      )}
    </div>
  );
}

export default LectureDetail;
