import { useState, useEffect } from "react";
import axios from "axios";

function MyGrades() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/my-grades/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setGrades(res.data));
  }, []);

  return (
    <div>
      <h2>My Grades</h2>
      <ul>
        {grades.map(g => (
          <li key={g.id}>
            Course: {g.submission.homework.lecture.course.title} <br />
            Homework: {g.submission.homework.text.substring(0,50)}... <br />
            Score: {g.score} <br />
            Comment: {g.comment || "No comment"} 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyGrades;
