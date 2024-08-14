import { useState } from "react";
import Notification from "../components/Notification";
import { fetchData } from '../utils/fetch.js';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password
    };

    try {
      const response = await fetchData("/login", "POST", userData);
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/")
      } else {
        setMessage(response.message || "Login error. Please try again.");
        setNotificationKey(prevKey => prevKey + 1);
      }


    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Error connecting to the server.");

      setNotificationKey(prevKey => prevKey + 1);
    }
  };

  return (
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="username"
            className="form-control form-control-lg w-100"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control form-control-lg w-100"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">
          Log In
        </button>
      </form>
      {message && <Notification key={notificationKey} message={message} />}
    </div>
  );
};

export default Login;
