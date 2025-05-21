import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import InfoModal from "../components/modals/InfoModal.jsx";
import PasswordRecoveryForm from "../components/PasswordRecoveryForm.jsx";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openReactivationModal = () => {
    setModalTitle("Account Reactivation");
    setModalContent(
      <>
        If you deactivated your account and want it back, contact our support
        and send your username and email.
        <br />
        <a
          href="mailto:bibliosupport@gmail.com?subject=Reactivation Request"
          className="text-info"
          target="_blank"
        >
          bibliosupport@gmail.com
        </a>
      </>
    );
    setShowModal(true);
  };

  const openPasswordRecoveryModal = () => {
    setModalTitle("Password Recovery");
    setModalContent(
      <PasswordRecoveryForm onClose={() => setShowModal(false)} />
    );
    setShowModal(true);
  };

  const handleHideModal = () => setShowModal(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error === "google_auth") {
      toast.error(
        "Google authentication failed. Check if you have an active account or contact support"
      );
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = { username, password };

    try {
      const response = await fetchData("/public/users/login", "POST", userData);
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
    window.location.href = "https://biliceu.store/oauth/login/google";
  };

  return (
    <main className="container mt-5" role="main">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg" aria-labelledby="loginTitle">
            <div className="card-body">
              <h2 id="loginTitle" className="card-title text-center mb-4">
                Log In
              </h2>
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
                    aria-describedby="usernameHelp"
                    required
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
                    aria-describedby="passwordHelp"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 shadow-sm"
                  aria-label="Log in to your account"
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100 shadow-sm mt-2"
                  onClick={handleGoogleLogin}
                  aria-label="Log in using your Google account"
                >
                  Log in with Google
                </button>
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={openReactivationModal}
                    className="btn btn-link p-0 me-3"
                    aria-label="View information about account reactivation"
                  >
                    Reactivation Info
                  </button>

                  <button
                    type="button"
                    onClick={openPasswordRecoveryModal}
                    className="btn btn-link p-0"
                    aria-label="View information about password recovery"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <InfoModal
        show={showModal}
        handleClose={handleHideModal}
        title={modalTitle}
        content={modalContent}
      />
    </main>
  );
};

export default Login;
