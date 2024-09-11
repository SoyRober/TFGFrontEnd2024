import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'
import EditAttributeModal from '../components/EditAttributeModal';
import EditDateModal from '../components/EditDateModal';

export default function Settings() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showBirthDateModal, setShowBirthDateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      setUsername(decodedToken.username)
      setEmail(decodedToken.email)
      setBirthDate(decodedToken.birthDate)
      
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

  const handleEditEmail = () => {
    setShowEmailModal(true);
  };

  const handleEditBirthDate = () => {
    setShowBirthDateModal(true);
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

  const handleSaveEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/changeEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldEmail: email,
          newEmail: newEmail
        })
      });
      const data = await response.json();
      if (data.success) {
        setEmail(newEmail);
        setShowEmailModal(false);
        setErrorMessage('');
        localStorage.setItem("token", data.token);
      } else {
        if(data.message){
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Email not changed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSaveBirthDate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/changeBirthDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          newBirthDate: newBirthDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setBirthDate(newBirthDate);
        setShowBirthDateModal(false);
        setErrorMessage('');
        localStorage.setItem("token", data.token);
      } else {
        if(data.message){
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: BirthDate not changed");
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
    setShowEmailModal(false)
    setShowBirthDateModal(false);
    setShowPasswordModal(false);
    setErrorMessage('');
  };

return (
  <div>
    <h1>Settings</h1>
    <p>User: {username}</p>
    <p>Email: {email}</p>
    <p>BirthDate: {birthDate ? new Date(birthDate).toLocaleDateString() : 'N/A'}</p>
    <p>Role: {role}</p>
    <button className="btn btn-primary mt-3" onClick={handleEditUsername}>Edit Username</button>
    <button className="btn btn-primary mt-3" onClick={handleEditEmail}>Edit Email</button>
    <button className="btn btn-primary mt-3" onClick={handleEditBirthDate}>Edit BirthDate</button>
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

    {/* Change birthDate */}
      <EditDateModal
        show={showBirthDateModal}
        onClose={handleCancel}
        attribute="Birth Date"
        value={newBirthDate}
        onChange={(e) => setNewBirthDate(e.target.value)}
        onSave={handleSaveBirthDate}
        errorMessage={errorMessage}
      />

    {/* Change Email */}
    <EditAttributeModal
      show={showEmailModal}
      onClose={handleCancel}
      attribute="Email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
      placeholder="newEmail@gmail.com"
      onSave={handleSaveEmail}
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