import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authTokens, user } = useAuth();

  const loadCourses = async () => {
    const token = authTokens?.access;

    if (!token) {
      setError("Пожалуйста, войдите в систему");
      navigate("/login/");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:8000/api/v1/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      setError("Не удалось загрузить курсы. Проверьте консоль.");
      console.error("Ошибка загрузки курсов:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот курс?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      setError("Не удалось удалить курс. Проверьте консоль.");
      console.error("Ошибка удаления курса:", err);
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleAddCourse = () => {
    navigate("/courses/add");
  };

  useEffect(() => {
    console.log("User:", user);
    loadCourses();
  }, [authTokens]);

  return (
    <div className="course-list-container">
      <h2 className="course-list-title">Courses</h2>
      {error && <p className="error">{error}</p>}
      {user?.role === "TEACHER" && (
        <button onClick={handleAddCourse} className="btn btn-primary">
          Add course
        </button>
      )}
      {loading ? (
        <div className="loading">
          <span className="spinner"></span>Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <p className="no-courses">No available courses</p>
      ) : (
        <ul className="course-list-ul">
          {courses.map((course) => (
            <li key={course.id} className="course-item">
              <div className="course-info">
                <span
                  className="course-title"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  {course.title}
                </span>
                <span className="course-teacher">
                  (Teacher: {course.teacher.username})
                </span>
              </div>
              {user?.role === "TEACHER" && course.teacher.id === user.id && (
                <div className="course-actions">
                  <button
                    onClick={() => handleEdit(course.id)}
                    className="btn btn-primary btn-small"
                    aria-label={`Edit course ${course.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn btn-danger btn-small"
                    aria-label={`Delete course ${course.title}`}
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
}

export default CourseList;