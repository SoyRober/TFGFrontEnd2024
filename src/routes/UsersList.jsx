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
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && jwtDecode(token).role === "USER") navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    if (isFetching) return;
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    setIsFetching(true);
    try {
      const data = await fetchData(
        `/users/list?page=${page}`,
        "GET",
        null,
        token
      );
      if (data.message.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prev) => [...prev, ...data.message]);
      }
    } catch (error) {
      toast.error(error.message || "Error loading the users list");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMoreUsers = () => {
    if (hasMore && !isFetching) {
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
      setUsers(users.filter((user) => user.id !== selectedUserId));
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

  return (
    <main className="container">
      <h2>User List</h2>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreUsers}
        hasMore={users.length % 10 === 0}
        loader={<Loading />}
        endMessage={
          <p className="text-center mt-4">No more users to show</p>
        }
      >
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
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
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
