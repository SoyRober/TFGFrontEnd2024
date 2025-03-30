import { useState } from "react";
import { fetchData } from "../utils/fetch.js";
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
      username: username,
      password: password,
    };

    try {
      const response = await fetchData("/users/login", "POST", userData);
      if (response.success) {
        localStorage.setItem("token", response.message);
        navigate("/");
      } else {
        setMessage(response.message || "Login error. Please try again.");
        setNotificationKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      console.log(error.message);
      setMessage("Error connecting to the server.");

      setNotificationKey((prevKey) => prevKey + 1);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth/login/google";
  };

  return (
    <main className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Log In</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
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
                    className="form-control shadow-sm"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 shadow-sm"
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100 shadow-sm mt-2"
                  onClick={handleGoogleLogin}
                >
                  Log in with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
