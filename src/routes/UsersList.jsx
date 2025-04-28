import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal.jsx";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading.jsx";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState({ username: "", email: "" });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && jwtDecode(token).role === "USER") navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  useEffect(() => {
    setUsers([]);  
    setPage(0);    
  }, [filters]);

  const fetchUsers = async () => {
    if (isFetching) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
  
    setIsFetching(true);
  
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      if (filters.username) params.append("username", filters.username); 
      if (filters.email) params.append("email", filters.email);
      if (filters.role) params.append("role", filters.role);
  
      const url = `/users/list?${params.toString()}`;
      const data = await fetchData(url, "GET", null, token);
      
      if (!Array.isArray(data.message)) {
        toast.error("Something went wrong");
        return;
      }
  
      if (data.message.length !== 0) {
        setUsers((prev) => (reset ? data.message : [...prev, ...data.message]));
        setReset(false); 
      }
  
    } catch (error) {
      toast.error(error.message || "Error loading the users list");
    } finally {
      setIsFetching(false);
    }
  };  

  const fetchMoreUsers = () => {
    if (!isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const deleteUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    try {
      const data = await fetchData(
        `/users/${selectedUserId}`,
        "DELETE",
        null,
        token
      );
      if (data.success) toast.success(data.message);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
      setShowDeleteConfirmation(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowDeleteConfirmation(true);
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/${encodeURIComponent(id)}`);
  };

  const resetFilters = () => {
    setFilters({ username: "", email: "", role: "" });
    setPage(0); 
    setReset(true);
  };

  return (
    <main className="container">
      <h2>User List</h2>
      <div className="filters mb-4 row justify-content-center">
        <div className="col-12 col-md-5 col-lg-4 mb-2">
          <input
            type="text"
            placeholder="Filter by username"
            className="form-control"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, username: e.target.value.trim() }));
            }}
          />
        </div>
        <div className="col-12 col-md-5 col-lg-4 mb-2">
          <input
            type="text"
            placeholder="Filter by email"
            className="form-control"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, email: e.target.value.trim() }));
            }}
          />
        </div>
        <div className="col-12 col-md-5 col-lg-4 mb-2">
          <select
            className="form-control"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, role: e.target.value }));
            }}
          >
            <option value="">Filter by role</option>
            <option value="user">User</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-12 col-md-2 d-flex justify-content-center">
          <button className="btn btn-warning w-100" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreUsers}
        hasMore={users.length % 10 === 0 && users.length > 0}
        loader={<Loading />}
        endMessage={<p className="text-center mt-4">No more users to show</p>}
      >
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  border: user.role.toLowerCase() === "admin"
                    ? "2px solid red"
                    : user.role.toLowerCase() === "librarian"
                    ? "2px solid blue"
                    : "none",
                }}
              >
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="btn btn-danger me-2"
                  >
                    Delete
                  </button>
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
      </InfiniteScroll>

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={deleteUser}
        message={`This user will be deleted. Are you sure?`}
      />
    </main>
  );
};

export default UsersList;
