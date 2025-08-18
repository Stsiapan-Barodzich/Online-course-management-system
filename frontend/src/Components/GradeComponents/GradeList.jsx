import { useState, useEffect } from "react";
import axios from "axios";

function GradeList({ courseId }) {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/grades/?course=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setGrades(res.data));
  }, [courseId]);

  const updateGrade = async (gradeId, score, comment) => {
    const token = localStorage.getItem("access");
    await axios.put(`/api/v1/grades/${gradeId}/`, { score, comment }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGrades(grades.map(g => g.id === gradeId ? { ...g, score, comment } : g));
  };

  return (
    <div>
      <h2>Grades</h2>
      <ul>
        {grades.map(g => (
          <li key={g.id}>
            {g.student.username} - Homework: {g.submission.homework.text.substring(0,50)}...
            <br />
            Score: <input type="number" defaultValue={g.score} onBlur={e => updateGrade(g.id, e.target.value, g.comment)} />
            Comment: <input type="text" defaultValue={g.comment} onBlur={e => updateGrade(g.id, g.score, e.target.value)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GradeList;
