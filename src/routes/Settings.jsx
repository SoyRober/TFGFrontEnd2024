import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'


export default function Settings() {
  c
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
        
      if (userRole === "ADMIN") {
        setIsAdmin(true);
      }      
    } else {
      //TODO Err
    }
  }, []);

return (
  <h1>Settings</h1>
);
}