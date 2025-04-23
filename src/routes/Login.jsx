import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ReactivationInfoModal from "../components/modals/ReactivationInfoModal.jsx";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error === "google_auth") {
      toast.error("Google authentication failed. Check if you have an account");
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { username, password };

    try {
      const response = await fetchData("/users/login", "POST", userData);
      if (response.success) {
        localStorage.setItem("token", response.message);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(response.message || "Login error. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Login error. Please try again.");
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
                <button type="submit" className="btn btn-primary w-100 shadow-sm">
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100 shadow-sm mt-2"
                  onClick={handleGoogleLogin}
                >
                  Log in with Google
                </button>
                <p className="mt-3 text-center">
                  <a href="#" onClick={handleShowModal} style={{ cursor: "pointer" }}>
                    Reactivation Info
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ReactivationInfoModal show={showModal} handleClose={handleHideModal} />
    </main>
  );
};

export default Login;
