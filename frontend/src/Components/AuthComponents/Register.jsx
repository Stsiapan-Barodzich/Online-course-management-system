import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Contexts/AuthContext";
import ErrorMessage from "../SharedComponents/ErrorMessage";
import styles from "@Styles/auth.module.css";

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // Значение по умолчанию
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/register/", { // Исправлен URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        const success = await loginUser(username, password);
        if (success) {
          navigate("/courses"); // Перенаправление на /courses после успешной регистрации
        } else {
          setError("Registration succeeded, but login failed.");
        }
      } else {
        const data = await response.json();
        setError(data.detail || "Registration failed.");
      }
    } catch (err) {
      setError("Error during registration.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.loginForm} onSubmit={handleRegister}>
        <h2>Register</h2>
        {error && <ErrorMessage message={error} />}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        <button className={styles.submitButton} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}