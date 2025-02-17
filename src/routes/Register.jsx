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
<main className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6 col-lg-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Sign Up</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username:</label>
              <input
                type="text"
                className="form-control shadow-sm"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control shadow-sm"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control shadow-sm"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">Birth Date:</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 shadow-sm">Sign Up</button>
          </form>
          {message && <Notification key={notificationKey} message={message} />}
        </div>
      </div>
    </div>
  </div>
</main>
  );
};

export default Register;
