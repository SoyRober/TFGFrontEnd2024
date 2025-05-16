import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "../../styles/main.css";
import { jwtDecode } from "jwt-decode";
import useCheckTokenExpiration from "../../hooks/checkToken.jsx";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications.jsx";
import LibrarySelector from "./LibrarySelector.jsx";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const key = useState(Date.now());
  const navigate = useNavigate();

  useCheckTokenExpiration();

  const updatePermissions = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = jwtDecode(token).role;

      setHasPermissions(userRole === "ADMIN" || userRole === "LIBRARIAN");
      setIsAdmin(userRole === "ADMIN");
    } else {
      setHasPermissions(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      updatePermissions();
    } else {
      setIsLoggedIn(false);
      setHasPermissions(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setIsLoggedIn(false);
    setHasPermissions(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {!isLoggedIn && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-3">
                <LibrarySelector />
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-light"
                  to="/login"
                  aria-label="Login Link"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-light"
                  to="/register"
                  aria-label="Register Link"
                >
                  Register
                </Link>
              </li>
            </ul>
          )}

          {isLoggedIn && (
            <div
              className="d-flex align-items-center ms-auto"
              style={{
                width: "400px",
                height: "50px",
                minWidth: "400px",
                minHeight: "50px",
              }}
            >
              <ul className="navbar-nav d-flex flex-row align-items-center">
                <li className="nav-item me-3">
                  <LibrarySelector />
                </li>
                <li className="nav-item me-3">
                  <Notifications />
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle text-light bg-dark"
                    id="navbarDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Profile Dropdown Button"
                  >
                    <span className="d-none d-lg-inline">Profile</span>
                    <i className="fas fa-user d-lg-none"></i>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end bg-dark"
                    aria-labelledby="navbarDropdown"
                    style={{
                      position: "absolute",
                      zIndex: 1050,
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item text-light hover-navbar"
                        to="/user/userSettings"
                        aria-label="Settings Link"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-light hover-navbar"
                        onClick={handleLogout}
                        aria-label="Logout Button"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <Outlet />
      <ToastContainer
        position="bottom-right"
        closeOnClick={true}
        draggable={true}
        theme="dark"
        aria-label="Toast Notifications"
      />
    </>
  );
}
