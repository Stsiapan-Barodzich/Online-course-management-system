import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";
import AddLectureForm from "../LectureComponents/AddLectureForm.jsx";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";
import AddSubmissionForm from "../SubmissionComponents/AddSubmissionForm.jsx";

const BASE_URL = "http://localhost:8000";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { authTokens, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    if (authTokens?.access) {
      loadCourse();
    }
  }, [authTokens]);

  const loadCourse = async () => {
    try {
      const headers = { Authorization: `Bearer ${authTokens.access}` };

      // Получаем курс
      const res = await axios.get(`${BASE_URL}/api/v1/courses/${courseId}/`, { headers });
      setCourse(res.data);

      // Получаем лекции курса
      const lectureRes = await axios.get(`${BASE_URL}/api/v1/lectures/?course=${courseId}`, { headers });
      setLectures(lectureRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load course");
    }
  };

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
  };

  if (!course) return <p>Loading course...</p>;

  return (
    <div>
      <h2>Course: {course.title}</h2>
      <p>Teacher: {course.teacher.username}</p>

      {user?.role === "TEACHER" && (
        <AddLectureForm courseId={courseId} onLectureAdded={loadCourse} />
      )}

      <h3>Lectures</h3>
      <ul>
        {lectures.map((lecture) => (
          <li key={lecture.id} onClick={() => handleLectureSelect(lecture)}>
            {lecture.topic}
          </li>
        ))}
      </ul>

      {selectedLecture && (
        <div>
          <h4>Selected Lecture: {selectedLecture.topic}</h4>
          {user?.role === "TEACHER" && <AddHomeworkForm lectureId={selectedLecture.id} />}
          {user?.role === "STUDENT" && selectedLecture.homework && (
            <AddSubmissionForm homeworkId={selectedLecture.homework.id} />
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
