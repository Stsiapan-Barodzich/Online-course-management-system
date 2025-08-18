import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditCourseForm() {
  const { id } = useParams(); // ID курса из URL
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const loadCourse = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first");
      navigate("/login/");
      return;
    }

    try {
      const res = await axios.get(`/api/v1/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle(res.data.title);
    } catch (err) {
      console.error(err);
      alert("Failed to load course");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    try {
      await axios.put(
        `/api/v1/courses/${id}/`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Course updated successfully");
      navigate("/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to update course");
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  return (
    <div>
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/courses")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditCourseForm;
