import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "USER") {
        navigate("/");
      }
    }
  }, [navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    try {
      const data = await fetchData(
        `/getUsers?page=${page}`,
        "GET",
        null,
        token
      );
      setUsers(data.message);
    } catch (error) {
      setErrorMessage("Error loading the users list");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const deleteUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    try {
      const data = await fetchData(
        `/deleteUser/${selectedUserEmail}`,
        "DELETE",
        null,
        token
      );
      if (data) {
        setErrorMessage(`User ${selectedUserEmail} deleted`);
      }
      setUsers(users.filter((user) => user.email !== selectedUserEmail));
      setShowDeleteConfirmation(false);
    } catch (error) {
      setErrorMessage("Error deleting user");
    }
  };

  const handleDeleteClick = (email) => {
    setSelectedUserEmail(email);
    setShowDeleteConfirmation(true);
  };

  const handleViewProfile = (email) => {
    navigate(`/profile/${encodeURIComponent(email)}`);
  };

  return (
    <main className="container">
      <h2>User List</h2>
      {errorMessage && <Notification message={errorMessage} />}

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={`${user.username}-${user.email}`}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => handleDeleteClick(user.email)}
                  className="btn btn-danger ml-2"
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleViewProfile(user.email)}
                  className="btn btn-primary"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={deleteUser}
        message={`This user with email "${selectedUserEmail}" will be deleted. Are you sure?`}
      />
    </main>
  );
};

export default UsersList;
