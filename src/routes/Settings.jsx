import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'


export default function Settings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      setUsername(decodedToken.username)
      
      if (userRole === "ADMIN") {
        setRole("ADMIN");
        setHasPermissions(true);
      } else if (userRole === "LIBRARIAN") {
        setRole("LIBRARIAN");
      } else setRole("USER");

    } else {
      //TODO Err
      console.log("Not user found")
    }

  }, []);

return (
  <div>
    <h1>Settings</h1>
    <p>User: {username}</p>
  </div>
);
}