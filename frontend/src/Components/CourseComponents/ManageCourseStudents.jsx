import { useState, useEffect } from "react";
import axios from "axios";
import AddSubmissionForm from "../SubmissionComponents/AddSubmissionForm.jsx";

function ManageCourseStudents({ courseId }) {
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/courses/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCourse(res.data));

    axios.get(`/api/v1/lectures/?course=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setLectures(res.data));
  }, [courseId]);

  return (
    <div>
      <h2>Course: {course?.title}</h2>

      <h3>Lectures</h3>
      <ul>
        {lectures.map(l => (
          <li key={l.id}>
            {l.topic}
            <AddSubmissionForm lectureId={l.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourseStudents;
