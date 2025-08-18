import { useState, useEffect } from "react";
import axios from "axios";

function SubmissionList({ homeworkId, role }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/submissions/?homework=${homeworkId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setSubmissions(res.data));
  }, [homeworkId]);

  return (
    <div>
      <h3>Submissions</h3>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id}>
            {role === "TEACHER" ? (
              <>{sub.student.username}: {sub.content.substring(0, 50)}...</>
            ) : (
              <>Your submission: {sub.content.substring(0, 50)}...</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubmissionList;
