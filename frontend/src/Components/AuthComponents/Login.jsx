import { useState } from "react";
import { useAuth } from "@Contexts/AuthContext";
import { useNavigate } from "react-router-dom"; 
import styles from "@Styles/auth.module.css";
import ErrorMessage from "../SharedComponents/ErrorMessage";

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const success = await loginUser(username, password);
      if (success) {
        navigate("/courses"); 
      } else {
        setError("Invalid login or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error while trying to log in.");
    }
    
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <>
      {error && <ErrorMessage message={error} />}
      <div className={styles.authContainer}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className={styles.formGroup}>
            <label htmlFor="username">Login</label>
            <input
              type="text"
              id="username"
              placeholder="Enter login"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Enter
          </button>
          <button 
            type="button" 
            className="btn btn-register"
            onClick={handleSignUp}
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
