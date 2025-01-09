import { useState } from "react";
import Notification from "../components/Notification";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      email,
      birthDate,
    };

    try {
      const response = await fetchData("/register", "POST", userData);

      if (response.success) {
        navigate("/");
        setMessage("Registration successful");
      } else {
        setMessage(response.message || "Registration error. Please try again.");
      }

      setNotificationKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("Error connecting to the server.");

      setNotificationKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
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
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control form-control-lg w-100"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">
            Birth Date:
          </label>
          <input
            type="date"
            className="form-control form-control-lg w-100"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">
          Sign Up
        </button>
      </form>
      {message && <Notification key={notificationKey} message={message} />}
    </div>
  );
};

export default Register;
