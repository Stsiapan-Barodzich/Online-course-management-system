import { useState } from "react";
import axios from "axios";

function EditHomeworkForm({ homework, onClose, onUpdate }) {
  const [text, setText] = useState(homework.text);

  const saveHomework = async () => {
    const token = localStorage.getItem("access");
    const res = await axios.put(`/api/v1/homework/${homework.id}/`, 
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onUpdate(res.data);
  };

  return (
    <div>
      <h3>Edit Homework</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <br />
      <button onClick={saveHomework}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditHomeworkForm;
