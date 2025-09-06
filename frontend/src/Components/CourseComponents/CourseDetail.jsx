import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@Contexts/AuthContext";
import AddLectureForm from "../LectureComponents/AddLectureForm.jsx";
import EditLectureForm from "../LectureComponents/EditLectureForm.jsx";

const BASE_URL = "http://localhost:8000";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { authTokens, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddLectureForm, setShowAddLectureForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  useEffect(() => {
    if (authTokens?.access) {
      loadCourse();
      loadLectures();
      loadStudents();
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

  const loadLectures = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/courses/${courseId}/lectures/`,
        { headers }
      );
      setLectures(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load lectures");
    }
  };


  const loadStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/courses/${courseId}/students/`, { headers });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/lectures/${lectureId}/`, { headers });
        setLectures(lectures.filter((lecture) => lecture.id !== lectureId));
      } catch (err) {
        console.error(err);
        alert("Failed to delete lecture");
      }
    }
  };

  const handleUpdateLecture = (updatedLecture) => {
    setLectures(
      lectures.map((lecture) =>
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      )
    );
  };

  if (!course) return <div className="loading"><span className="spinner"></span>Loading course...</div>;

  return (
    <div className="course-detail-container">
      <button
        onClick={() => navigate("/courses")}
        className="btn-back-prev"
      >
        To Previous
      </button>
      <h2 className="course-detail-title">Course: {course.title}</h2>
      <p className="course-detail-teacher">Teacher: {course.teacher.username}</p>
      <p className="course-detail-description">{course.description || "No description available"}</p>

      {user?.role === "TEACHER" && (
        <div className="course-detail-actions">
          <button
            onClick={() => navigate(`/courses/${courseId}/students`)}
            className="btn btn-primary btn-small"
          >
            Add student
          </button>
          <button
            onClick={() => setShowAddLectureForm((prev) => !prev)}
            className="btn btn-success btn-small"
          >
            {showAddLectureForm ? "Back" : "Add lecture"}
          </button>
        </div>
      )}

      {showAddLectureForm && (
        <AddLectureForm
          courseId={courseId}
          onLectureAdded={() => {
            loadLectures();
            setShowAddLectureForm(false);
          }}
        />
      )}

      {editingLecture && (
        <EditLectureForm
          lecture={editingLecture}
          courseId={courseId}
          onClose={() => setEditingLecture(null)}
          onUpdate={handleUpdateLecture}
        />
      )}

      <h3 className="section-title">Lectures</h3>
      {lectures.length === 0 ? (
        <p className="no-items">No lectures yet</p>
      ) : (
        <ul className="item-list">
          {lectures.map((lecture) => (
            <li key={lecture.id} className="item">
              <button
                onClick={() => navigate(`/courses/${courseId}/lectures/${lecture.id}`)}
                className="btn btn-link item-link"
              >
                {lecture.topic}
              </button>
              {user?.role === "TEACHER" && (
                <div className="lecture-actions" style={{
                  display: "flex",
                  gap: "8px",       
                  marginTop: "4px"
                }}>
                  <button
                    onClick={() => setEditingLecture(lecture)}
                    className="btn btn-primary btn-small"
                    style={{ flex: 1 }}   
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLecture(lecture.id)}
                    className="btn btn-danger btn-small"
                    style={{ flex: 1 }}   
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseDetail;