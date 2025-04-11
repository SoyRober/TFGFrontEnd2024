import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from "jwt-decode";
import useCheckTokenExpiration from "../hooks/checkToken.jsx";
import { useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications.jsx";
import LibrarySelector from "../components/LibrarySelector.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
        key={key}
      >
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

          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >
            <ul className="navbar-nav me-auto">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-light" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-light ms-3" to="/userBookDetails">
                      My books
                    </Link>
                  </li>
                  {hasPermissions && (
                    <li className="nav-item">
                      <Link className="nav-link text-light ms-3" to="/usersList">
                        Users List
                      </Link>
                    </li>
                  )}
                  
                  {hasPermissions && (
                    <li className="nav-item">
                      <Link className="nav-link text-light ms-3" to="/attributes">
                        Attributes
                      </Link>
                    </li>
                  )}

                  {hasPermissions && (
                    <li className="nav-item">
                      <Link className="nav-link text-light ms-3" to="/pendingBooks">
                      PendingBooks
                      </Link>
                    </li>
                  )}            
                </>
              )}
            </ul>
          </div>

          {isLoggedIn && (
            <div className="d-flex align-items-center ms-auto">
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
                      >
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
              </ul>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
      <ToastContainer position={"bottom-right"} closeOnClick={true} draggable={true} theme={"dark"}/>
    </>
  );
}
