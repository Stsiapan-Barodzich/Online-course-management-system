import { useState, useEffect } from "react";
import axios from "axios";

function LectureDetail({ lectureId }) {
  const [lecture, setLecture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(`/api/v1/lectures/${lectureId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setLecture(res.data));
  }, [lectureId]);

  if (!lecture) return <div>Loading...</div>;

  return (
    <div>
      <h3>{lecture.topic}</h3>
      {lecture.presentation && (
        <a href={lecture.presentation} target="_blank" rel="noreferrer">Download Presentation</a>
      )}
    </div>
  );
}

export default LectureDetail;
