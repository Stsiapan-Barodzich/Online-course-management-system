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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  useEffect(() => {
    if (authTokens?.access) {
      loadCourse();
      loadAllStudents();
    }
  }, [authTokens, courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/courses/${courseId}/`, { headers });
      setCourse(res.data);
    } catch (err) {
      setError("Failed to load course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/students/`, { headers });
      setAllStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setError("Please select a student");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.post(
        `${BASE_URL}/api/v1/courses/${courseId}/add-student/`,
        { student_id: selectedStudentId },
        { headers }
      );
      loadCourse();
      setSelectedStudentId("");
    } catch (err) {
      setError("Failed to add student");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <div className="loading"><span className="spinner"></span>Loading course...</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">Manage Students for {course.title}</h2>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loading">
          <span className="spinner"></span>Loading...
        </div>
      )}
      <h3 className="section-title">Current Students</h3>
      {course.students.length === 0 ? (
        <p className="no-items">No students enrolled</p>
      ) : (
        <ul className="item-list">
          {course.students.map((student) => (
            <li key={student.id} className="item">
              <span className="item-text">{student.username}</span>
            </li>
          ))}
        </ul>
      )}
      <h3 className="section-title">Add Student</h3>
      <form onSubmit={handleAddStudent} className="form">
        <div className="form-group">
          <label className="form-label">Select Student</label>
          <select
            className="form-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            disabled={loading}
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
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-small"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageCourseStudents;