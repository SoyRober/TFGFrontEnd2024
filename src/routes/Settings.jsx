import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'
import EditAttributeModal from '../components/EditAttributeModal';

export default function Settings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    setShowUsernameModal(true);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleSaveUsername = async () => {
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
        setShowUsernameModal(false);
        setErrorMessage('');
        localStorage.setItem("token", data.token);
      } else {
        if(data.message){
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Username not changed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSavePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowPasswordModal(false);
        setErrorMessage('');
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Password not changed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    setShowUsernameModal(false);
    setShowPasswordModal(false);
    setErrorMessage('');
  };

return (
  <div>
    <h1>Settings</h1>
    <p>User: {username}</p> 
    <button className="btn btn-primary mt-3" onClick={handleEditUsername}>Edit Username</button>
    <button className="btn btn-secondary mt-3 ml-2" onClick={handleChangePassword}>Change Password</button>

    {/* Change username */}
    <EditAttributeModal
      show={showUsernameModal}
      onClose={handleCancel}
      attribute="Username"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      placeholder="Enter new username"
      onSave={handleSaveUsername}
      errorMessage={errorMessage}
    />

    {/* Change password */}
    <Modal show={showPasswordModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
        </Form.Group>
        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSavePassword}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
);
}