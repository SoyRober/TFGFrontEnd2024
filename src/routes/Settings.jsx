import { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
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
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username)
      setEmail(decodedToken.email)
      setBirthDate(decodedToken.birthDate)
      setRole(decodedToken.role);
      setHasPermissions(decodedToken.role === "ADMIN");

    } else {
      //Redirect to home or login
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Settings</h1>
      
      {/* User info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h5 className="card-title">User Information</h5>
          <p className="card-text">Username: {username}</p>
          <p className="card-text">Email: {email}</p>
          <p className="card-text">BirthDate: {birthDate ? new Date(birthDate).toLocaleDateString() : 'N/A'}</p>
          <p className="card-text">Role: {role}</p>
        </div>
      </div>

      {/* Edit buttons */}
      <div className="d-flex flex-column align-items-center">
        <button className="btn btn-primary mb-3 w-50" onClick={handleEditUsername}>Edit Username</button>
        <button className="btn btn-primary mb-3 w-50" onClick={handleEditEmail}>Edit Email</button>
        <button className="btn btn-primary mb-3 w-50" onClick={handleEditBirthDate}>Edit BirthDate</button>
        <button className="btn btn-secondary mb-3 w-50" onClick={handleChangePassword}>Change Password</button>
      </div>

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
            <Form.Control type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Group>
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSavePassword}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}