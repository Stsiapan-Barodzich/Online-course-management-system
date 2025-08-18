import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { authTokens, user } = useAuth();

  const loadCourses = async () => {
    const token = authTokens?.access;

    if (!token) {
      alert("Please login first");
      navigate("/login/");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/v1/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      alert("Failed to load courses. Please check console for details.");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/courses/${courseId}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("Failed to delete course. Check console.");
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/courses/edit/${courseId}`);
  };

  const handleAddCourse = () => {
    navigate("/courses/add");
  };

  useEffect(() => {
    console.log("User:", user);
    loadCourses();
  }, []);

  return (
    <div>
      <h2>Courses</h2>
      {user?.role === "TEACHER" && (
        <button onClick={handleAddCourse} style={{ marginBottom: "15px" }}>
          Add Course
        </button>
      )}
      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id} style={{ marginBottom: "10px" }}>
              {course.title} (Teacher: {course.teacher.username})
              {user?.role === "TEACHER" && course.teacher.id === user.id && (
                <>
                  <button
                    onClick={() => handleEdit(course.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    style={{ marginLeft: "5px" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;
