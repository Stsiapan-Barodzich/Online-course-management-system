import { useState, useEffect } from "react";
import axios from "axios";
import AddLectureForm from "../LectureComponents/AddLectureForm.jsx";
import AddHomeworkForm from "../HomeworkComponents/AddHomeworkForm.jsx";

function ManageCourseTeachers({ courseId }) {
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [showAddHomework, setShowAddHomework] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/courses/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCourse(res.data));

    axios.get(`/api/v1/courses/${courseId}/students/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setStudents(res.data));
  }, [courseId]);

  const addStudent = async (studentId) => {
    const token = localStorage.getItem("access");
    await axios.post(`/api/v1/courses/${courseId}/add-student/`, { student_id: studentId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // обновить список студентов
  };

  const removeStudent = async (studentId) => {
    const token = localStorage.getItem("access");
    await axios.post(`/api/v1/courses/${courseId}/remove-student/`, { student_id: studentId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // обновить список студентов
  };

  return (
    <div>
      <h2>Manage Course: {course?.title}</h2>
      <h3>Students</h3>
      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.username}
            <button onClick={() => removeStudent(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addStudent(prompt("Student ID:"))}>Add Student</button>

      <h3>Lectures</h3>
      <button onClick={() => setShowAddLecture(!showAddLecture)}>Add Lecture</button>
      {showAddLecture && <AddLectureForm courseId={courseId} />}

      <h3>Homework</h3>
      <button onClick={() => setShowAddHomework(!showAddHomework)}>Add Homework</button>
      {showAddHomework && <AddHomeworkForm courseId={courseId} />}
    </div>
  );
}

export default ManageCourseTeachers;
