import { useState } from "react";
import axios from "axios";

function EditLectureForm({ lecture, onClose, onUpdate }) {
  const [topic, setTopic] = useState(lecture.topic);
  const [file, setFile] = useState(null);

  const saveLecture = async () => {
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("topic", topic);
    if (file) formData.append("presentation", file);

    const res = await axios.put(`/api/v1/lectures/${lecture.id}/`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    });

    onUpdate(res.data);
  };

  return (
    <div>
      <h3>Edit Lecture</h3>
      <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <br />
      <button onClick={saveLecture}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditLectureForm;
