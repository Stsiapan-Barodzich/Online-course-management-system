import { useState } from "react";
import axios from "axios";

function MySubmissions({ homeworkId, onSubmitted }) {
  const [content, setContent] = useState("");

  const submitHomework = async () => {
    if (!content) return alert("Please enter your submission");
    const token = localStorage.getItem("access");
    try {
      await axios.post("/api/v1/submissions/", {
        content,
        homework: homeworkId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent("");
      onSubmitted && onSubmitted(); // чтобы обновить список
    } catch (err) {
      console.error(err);
      alert("Failed to submit homework");
    }
  };

  return (
    <div>
      <h3>Submit Homework</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your submission here..."
      />
      <br />
      <button onClick={submitHomework}>Submit</button>
    </div>
  );
}

export default MySubmissions;
