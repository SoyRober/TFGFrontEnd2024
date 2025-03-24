import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { jwtDecode } from "jwt-decode";
import EditAttributeModal from "../components/EditAttributeModal";
import EditDateModal from "../components/EditDateModal";
import { fetchData } from "../utils/fetch";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../img/defaultAvatar.svg";
import { compressImage } from "../utils/compressImage";

export default function Settings() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showBirthDateModal, setShowBirthDateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const [showChangeText, setShowChangeText] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);

  const handleMouseEnter = () => setShowChangeText(true);
  const handleMouseLeave = () => setShowChangeText(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      setEmail(decodedToken.email);
      setBirthDate(decodedToken.birthDate);
      setRole(decodedToken.role);

      const fetchProfileImage = async () => {
        const image = await getProfileImage(decodedToken.email);
        setProfileImage(image);
      };

      fetchProfileImage();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getProfileImage = async (email) => {
    const image = await fetchData(`/getUserProfileImage/${email}`, "GET");
    return image ? `data:image/jpeg;base64,${image}` : null;
  };

  const handleEditUsername = () => {
    setShowUsernameModal(true);
  };

  const handleEditEmail = () => {
    setShowEmailModal(true);
  };

  const handleEditBirthDate = () => {
    setShowBirthDateModal(true);
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(`/hasPassword?email=${email}`, "GET", null, token);
      if (data) {
        setShowPasswordModal(true);
      } else {
        setShowSetPasswordModal(true);
      }
    } catch (error) {
      console.log(error.message)
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSaveUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/changeUsername`,
        "POST",
        {
          oldUsername: username,
          newUsername: newUsername,
        },
        token
      );

      if (data.success) {
        setUsername(newUsername);
        setShowUsernameModal(false);
        setErrorMessage("");
        localStorage.setItem("token", data.token);
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Username not changed");
        }
      }
    } catch (error) {
      console.log(error.message)
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSaveEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/changeEmail`,
        "POST",
        {
          oldEmail: email,
          newEmail: newEmail,
        },
        token
      );

      if (data.success) {
        setEmail(newEmail);
        setShowEmailModal(false);
        setErrorMessage("");
        localStorage.setItem("token", data.token);
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Email not changed");
        }
      }
    } catch (error) {
      console.log(error.message)
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSaveBirthDate = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/changeBirthDate`,
        "POST",
        {
          username: username,
          newBirthDate: newBirthDate,
        },
        token
      );
      if (data.success) {
        setBirthDate(newBirthDate);
        setShowBirthDateModal(false);
        setErrorMessage("");
        localStorage.setItem("token", data.token);
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: BirthDate not changed");
        }
      }
    } catch (error) {
      console.log(error.message)
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSavePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/changePassword`,
        "POST",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        token
      );
      if (data.success) {
        setShowPasswordModal(false);
        setErrorMessage("");
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Password not changed");
        }
      }
    } catch (error) {
      console.error("Error:", error);      console.log(error.message)

      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSaveSetPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/setPassword`,
        "POST",
        {
          newPassword: newPassword,
        },
        token
      );
      if (data.success) {
        setShowSetPasswordModal(false);
        setErrorMessage("");
      } else {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Error: Password not set");
        }
      }
    } catch (error) {
      console.log(error.message)
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    setShowUsernameModal(false);
    setShowEmailModal(false);
    setShowBirthDateModal(false);
    setShowPasswordModal(false);
    setShowSetPasswordModal(false);
    setErrorMessage("");
  };

  const handleImageChange = async (event) => {
    const token = localStorage.getItem("token");
    const file = event.target.files[0];
  
    if (file) {
      const compressedImage = await compressImage(file, 1, 400, 400); // Calidad 0.7 y 300x300px
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(compressedImage);
  
      const formData = new FormData();
      formData.append("image", compressedImage);
  
      const response = await fetchData(`/updateProfileImage`, "POST", formData, token);
  
      if (response.success) {
        const updatedImage = await getProfileImage(email);
        setProfileImage(updatedImage);
      }
    }
  };

  return (
    <main className="container mt-5">
      <h1 className="text-center mb-4">Settings</h1>

      <section className="card shadow-sm mb-4">
        <div
          className="card-body d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="row w-100">
            <div className="col-md-4 d-flex justify-content-center mb-4">
              <div
                style={{
                  position: "relative",
                  width: "250px",
                  height: "250px",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    document.querySelector('input[type="file"]').click();
                    e.preventDefault();
                  }
                }}
                aria-label="Change Profile Image"
              >
                <label
                  style={{
                    border: "1px solid black",
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundImage:
                      profileImage != null
                        ? `url(${profileImage})`
                        : `url(${defaultAvatar})`,
                    backgroundPosition: "center",
                    cursor: "pointer",
                    backgroundSize: "cover",
                  }}
                >
                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={{
                      display: "none",
                    }}
                    aria-hidden="true"
                  />
                </label>

                {showChangeText && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    Change Image
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-4 text-center">
              <h5 className="card-title">User Information</h5>
              <p className="card-text">Username: {username}</p>
              <p className="card-text">Email: {email}</p>
              <p className="card-text">
                BirthDate:{" "}
                {birthDate && !isNaN(new Date(birthDate).getTime())
                  ? new Date(birthDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="card-text">Role: {role}</p>
            </div>

            <div className="col-md-4 d-flex flex-column align-items-center">
              <button
                className="btn btn-primary mb-3 w-50"
                onClick={handleEditUsername}
              >
                Edit Username
              </button>
              <button
                className="btn btn-primary mb-3 w-50"
                onClick={handleEditEmail}
              >
                Edit Email
              </button>
              <button
                className="btn btn-primary mb-3 w-50"
                onClick={handleEditBirthDate}
              >
                Edit BirthDate
              </button>
              <button
                className="btn btn-secondary mb-3 w-50"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>

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

      <EditDateModal
        show={showBirthDateModal}
        onClose={handleCancel}
        attribute="Birth Date"
        value={newBirthDate}
        onChange={(e) => setNewBirthDate(e.target.value)}
        onSave={handleSaveBirthDate}
        errorMessage={errorMessage}
      />

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
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
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

      <Modal show={showSetPasswordModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Set Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
          </Form.Group>
          {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveSetPassword}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
