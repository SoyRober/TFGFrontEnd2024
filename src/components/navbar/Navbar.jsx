import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/main.css";
import jwtDecode from "jwt-decode";
import useCheckTokenExpiration from "../../hooks/checkToken.jsx";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import Notifications from "./Notifications.jsx";
import LibrarySelector from "./LibrarySelector.jsx";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";

export default function Root() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
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
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      updatePermissions();
    } else {
      setIsLoggedIn(false);
      setHasPermissions(false);
      setIsAdmin(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setHasPermissions(false);
    setIsAdmin(false);
    navigate("/");
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((open) => !open);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top" role="navigation">
        <div className="container-fluid">
          <Link className="navbar-brand text-light" to="/">
            Home
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-light ms-3" to="/search">
                  Search
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light ms-3" to="/userBookDetails">
                      My books
                    </Link>
                  </li>
                  {hasPermissions && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link text-light ms-3" to="/usersList">
                          Users List
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link text-light ms-3" to="/attributes">
                          Attributes
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link text-light ms-3" to="/pendingBooks">
                          PendingBooks
                        </Link>
                      </li>
                      {isAdmin ? (
                        <li className="nav-item">
                          <Link className="nav-link text-light ms-3" to="/libraries">
                            Libraries
                          </Link>
                        </li>
                      ) : (
                        <li className="nav-item">
                          <Link className="nav-link text-light ms-3" to="/managedLibraries">
                            Managed Libraries
                          </Link>
                        </li>
                      )}
                    </>
                  )}
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto d-flex flex-row align-items-center">
              <li className="nav-item me-3">
                <LibrarySelector />
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item me-3">
                    <Notifications />
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      type="button"
                      className="nav-link dropdown-toggle text-light bg-dark border-0"
                      id="navbarDropdown"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      onClick={toggleDropdown}
                    >
                      <span className="d-none d-lg-inline">Profile</span>
                      <i className="fas fa-user d-lg-none"></i>
                    </button>
                    <ul
                      className={`dropdown-menu dropdown-menu-end bg-dark${dropdownOpen ? " show" : ""}`}
                      aria-labelledby="navbarDropdown"
                      style={{ position: "absolute", zIndex: 1050 }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <li>
                        <Link className="dropdown-item text-light hover-navbar" to="/user/userSettings">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-light hover-navbar"
                          onClick={handleLogout}
                        >
                          Log out
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light ms-3" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-light ms-3" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
      <ToastContainer
        position="bottom-right"
        closeOnClick
        draggable
        theme="dark"
        aria-live="polite"
        aria-atomic="true"
      />
    </>
  );
}
