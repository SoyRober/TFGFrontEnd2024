import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'


export default function Settings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
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
      //TODO manage error
      console.log("Not user found")
    }

  }, []);

  const handleEditUsername = () => {
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/changeUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldUsername: username,
          newUsername: newUsername
        })
      });
      const data = await response.json();
      if (data.success) {
        setUsername(newUsername);
        setShowModal(false);
        console.log(token);
        console.log(data.token);
        localStorage.setItem("token", data.token);
      } else {
        console.log("Error: Username not changed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

return (
  <div>
    <h1>Settings</h1>
    <p>User: {username}</p> <button className="btn btn-primary mt-3" onClick={handleEditUsername}>Edit Username</button>
    <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Username</Form.Label>
            <Form.Control
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
);
}