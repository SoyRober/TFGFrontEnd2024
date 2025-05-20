import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal.jsx";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading.jsx";
import ResetButtonFilter from "../components/ResetButtonFilter.jsx"; //

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

      const url = `/librarian/users/list?${params.toString()}`;
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
        `/user/users/${selectedUserId}`,
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

  const getRowStyle = (role) => {
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
      case "admin":
        return { backgroundColor: "rgba(255, 109, 121, 0.7)" };
      case "librarian":
        return { backgroundColor: "rgba(214, 158, 94, 0.7)" };
      default:
        return { backgroundColor: "rgba(255, 255, 255, 1)" };
    }
  };

  return (
    <main className="container">
      <h2>User List</h2>
      <form
        className="row w-100 justify-content-center mb-4"
        aria-label="User Filters Form"
      >
        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by username"
            value={filters.username}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                username: e.target.value.trim(),
              }))
            }
            aria-label="Filter users by username"
            style={{ flexGrow: 1 }}
          />
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, username: "" }));
              setPage(0);
              setReset(true);
            }}
            ariaLabel="Reset Username Filter Button"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, email: e.target.value.trim() }))
            }
            aria-label="Filter users by email"
            style={{ flexGrow: 1 }}
          />
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, email: "" }));
              setPage(0);
              setReset(true);
            }}
            ariaLabel="Reset Email Filter Button"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-2">
          <select
            className="form-control"
            value={filters.role || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
            aria-label="Filter users by role"
            style={{ flexGrow: 1 }}
          >
            <option value="">Filter by role</option>
            <option value="user">User</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "" }));
              setPage(0);
              setReset(true);
            }}
            ariaLabel="Reset Role Filter Button"
          />
        </div>

        <div className="col-12 d-flex justify-content-center mt-2">
          <button
            className="btn btn-warning"
            type="button"
            onClick={resetFilters}
            aria-label="Reset all filters"
          >
            Reset All Filters
          </button>
        </div>
      </form>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreUsers}
        hasMore={users.length % 10 === 0 && users.length > 0}
        loader={<Loading />}
        endMessage={<p className="text-center mt-4">No more users to show</p>}
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const style = getRowStyle(user.role);
              return (
                <tr key={user.id}>
                  <td style={style}>{user.username}</td>
                  <td style={style}>{user.email}</td>
                  <td style={style}>{user.role}</td>
                  <td style={style}>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="btn btn-danger me-2"
                      aria-label={`Delete user ${user.username}`}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewProfile(user.email)}
                      className="btn btn-primary"
                      aria-label={`View profile of user ${user.username}`}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={deleteUser}
        message={`This user will be deleted. Are you sure?`}
        aria-label="Delete confirmation modal"
      />
    </main>
  );
};

export default UsersList;
