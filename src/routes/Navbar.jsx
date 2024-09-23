import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { jwtDecode } from 'jwt-decode'
import useCheckTokenExpiration from '../hooks/checkToken.jsx';

export default function Root() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const location = useLocation();
  const key = useState(Date.now());

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

  useCheckTokenExpiration();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setHasPermissions(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      console.log(userRole)
      if (userRole !== "USER") {
        setHasPermissions(true);
      } else {
        setHasPermissions(false);
      }
    } else {
      setHasPermissions(false);
    }
  }, [isLoggedIn, location]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top" key={key}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Home</Link>
          
          {isLoggedIn && (
            <Link className="nav-link ms-3" to="/user/loans">My Loans</Link>
          )}
          
          {hasPermissions && (
            <Link className="nav-link ms-3" to="/usersList">Users List</Link>
          )}
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ marginLeft: '-10px' }} 
                  >
                    Profile
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/user/settings">Settings</Link></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Log out</button></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
