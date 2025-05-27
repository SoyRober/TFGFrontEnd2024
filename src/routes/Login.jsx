import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import InfoModal from "../components/modals/InfoModal.jsx";

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos en ms

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const today = new Date().toDateString();
    const lastAttemptDate = localStorage.getItem("lastAttemptDate");
    if (lastAttemptDate !== today) {
      localStorage.setItem("loginAttempts", "0");
      localStorage.setItem("lastAttemptDate", today);
      localStorage.removeItem("lockTimestamp");
      setAttempts(0);
      setIsLocked(false);
    } else {
      const savedAttempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
      setAttempts(savedAttempts);

      const lockTimestamp = parseInt(localStorage.getItem("lockTimestamp"));
      if (lockTimestamp) {
        const now = Date.now();
        if (now - lockTimestamp < LOCK_TIME) {
          setIsLocked(true);
          setRemainingTime(LOCK_TIME - (now - lockTimestamp));
        } else {
          localStorage.removeItem("lockTimestamp");
          setIsLocked(false);
          setAttempts(0);
          localStorage.setItem("loginAttempts", "0");
        }
      }
    }

    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error === "google_auth") {
      toast.error(
        "Google authentication failed. Check if you have an active account or contact support"
      );
    }
  }, [location]);

  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      const lockTimestamp = parseInt(localStorage.getItem("lockTimestamp"));
      if (!lockTimestamp) {
        setIsLocked(false);
        setRemainingTime(0);
        setAttempts(0);
        localStorage.setItem("loginAttempts", "0");
        clearInterval(interval);
        return;
      }
      const now = Date.now();
      const elapsed = now - lockTimestamp;
      if (elapsed >= LOCK_TIME) {
        setIsLocked(false);
        setRemainingTime(0);
        setAttempts(0);
        localStorage.setItem("loginAttempts", "0");
        localStorage.removeItem("lockTimestamp");
        clearInterval(interval);
      } else {
        setRemainingTime(LOCK_TIME - elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const openReactivationModal = () => {
    setModalTitle("Account Reactivation");
    setModalContent(
      <>
        If you deactivated your account and want it back, contact our support
        and send your username and email.
        <br />
        <a
          href="mailto:bibliosupport@gmail.com?subject=Reactivation Request"
          aria-label="Send an email to Bibliosupport for reactivation"
          className="text-info"
          target="_blank"
          rel="noreferrer"
        >
          biliceu.soporte@gmail.com
        </a>
      </>
    );
    setShowModal(true);
  };

  const openPasswordRecoveryModal = () => {
    setModalTitle("Account Recovery");
    setModalContent(
      <>
        If you want to recover your account, send your username and email to our
        support.
        <br />
        <a
          href="mailto:bibliosupport@gmail.com?subject=Password Recovery Request"
          aria-label="Send an email to Bibliosupport for password recovery"
          className="text-info"
          target="_blank"
          rel="noreferrer"
        >
          biliceu.soporte@gmail.com
        </a>
      </>
    );
    setShowModal(true);
  };

  const handleHideModal = () => setShowModal(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const userData = { username, password };

    try {
      const response = await fetchData("/public/users/login", "POST", userData);
      if (response.success) {
        localStorage.setItem("token", response.message);
        localStorage.setItem("loginAttempts", "0");
        localStorage.removeItem("lockTimestamp");
        setAttempts(0);
        setIsLocked(false);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          localStorage.setItem("loginAttempts", newAttempts.toString());
          if (newAttempts >= MAX_ATTEMPTS) {
            localStorage.setItem("lockTimestamp", Date.now().toString());
            setIsLocked(true);
            setRemainingTime(LOCK_TIME);
            toast.error("Maximum login attempts reached. Try again in 5 minutes.");
          } else {
            toast.error(response.message || "Login error. Please try again.");
          }
          return newAttempts;
        });
      }
    } catch (error) {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        localStorage.setItem("loginAttempts", newAttempts.toString());
        if (newAttempts >= MAX_ATTEMPTS) {
          localStorage.setItem("lockTimestamp", Date.now().toString());
          setIsLocked(true);
          setRemainingTime(LOCK_TIME);
          toast.error("Maximum login attempts reached. Try again in 5 minutes.");
        } else {
          toast.error(error.message || "Login error. Please try again.");
        }
        return newAttempts;
      });
    }
  };

  const handleGoogleLogin = () => {
    if (isLocked) return;
    const googleClientId =
      "115537997590-sefunkh5od17kagalf4747ov5trjt387.apps.googleusercontent.com";
    const redirectUri = "https://biliceu.store/oauth/callback";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;

    window.location.href = authUrl;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
                    disabled={isLocked}
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
                    disabled={isLocked}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 shadow-sm"
                  aria-label="Log in to your account"
                  disabled={isLocked}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100 shadow-sm mt-2"
                  onClick={handleGoogleLogin}
                  aria-label="Log in using your Google account"
                  disabled={isLocked}
                >
                  Log in with Google
                </button>
                <div className="mt-3 d-flex justify-content-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={openReactivationModal}
                    className="btn btn-link p-0"
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
                {isLocked && (
                  <div className="alert alert-danger mt-3" role="alert">
                    You have reached the maximum number of login attempts. Please
                    try again in {formatTime(remainingTime)}.
                  </div>
                )}
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
