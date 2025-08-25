import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";

const BASE_URL = "http://localhost:8000";

const ManageCourseStudents = () => {
  const { courseId } = useParams();
  const { authTokens } = useAuth();
  const [course, setCourse] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  useEffect(() => {
    if (authTokens?.access) {
      loadCourse();
      loadAllStudents();
    }
  }, [authTokens, courseId]);

  const loadCourse = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/courses/${courseId}/`, { headers });
      setCourse(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load course");
    }
  };

  const loadAllStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/students/`, { headers });
      setAllStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    try {
      await axios.post(
        `${BASE_URL}/api/v1/courses/${courseId}/add-student/`,
        { student_id: selectedStudentId },
        { headers }
      );
      alert("Student added successfully");
      loadCourse(); 
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  if (!course) return <p>Loading course...</p>;

  return (
    <div>
      <h2>Manage Students for {course.title}</h2>

      <h3>Current Students</h3>
      <ul>
        {course.students.map((student) => (
          <li key={student.id}>{student.username}</li>
        ))}
      </ul>

      <h3>Add Student</h3>
      <form onSubmit={handleAddStudent}>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">Select a student</option>
          {allStudents
            .filter((s) => !course.students.some((cs) => cs.id === s.id)) 
            .map((student) => (
              <option key={student.id} value={student.id}>
                {student.username}
              </option>
            ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ManageCourseStudents;
