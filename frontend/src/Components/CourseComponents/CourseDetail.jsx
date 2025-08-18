import React, { useState, useEffect } from "react";
import axios from "axios";
import AddLectureForm from "../LectureComponents/AddLectureForm.jsx";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";
import AddSubmissionForm from "../SubmissionComponents/AddSubmissionForm.jsx";

const CourseDetail = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    loadCourse();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/v1/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCourse = async () => {
    try {
      const res = await axios.get(`/api/v1/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);

      // Load lectures
      const lectureRes = await axios.get(`/api/v1/lectures/?course=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLectures(lectureRes.data);
    } catch (err) {
      console.error(err);
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

      {role === "TEACHER" && <AddLectureForm courseId={courseId} onLectureAdded={loadCourse} />}

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
          {role === "TEACHER" && <AddHomeworkForm lectureId={selectedLecture.id} />}
          {role === "STUDENT" && <AddSubmissionForm homeworkId={selectedLecture.homework?.id} />}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
