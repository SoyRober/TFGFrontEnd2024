import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ChangeRoleModal from "../components/modals/changeRoleModal";

const ViewProfile = () => {
  const [userData, setUserData] = useState({});
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const navigate = useNavigate();
  const { email } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = jwtDecode(token).role;
      setUserRole(role);
      if (role === "USER") {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, user might not be authenticated");
        return navigate("/");
      }
      try {
        const data = await fetchData(
          `/users/info/${email}`,
          "GET",
          null,
          token
        );
        setUserData(data.message);
      } catch (error) {
        toast.error("Error loading user profile: " + error.message);
      }
    };

    fetchUserProfile();
  }, [email, navigate]);

  const handleReturnBook = async (bookTitle, email) => {
    const token = localStorage.getItem("token");
    if (!window.confirm(`Returning book: ${bookTitle}. Are you sure?`)) {
      return;
    }
    try {
      const response = await fetchData(
        "/return",
        "PUT",
        { title: bookTitle, user: email },
        token
      );
      if (response.success) {
        toast.success(`The book "${bookTitle}" has been returned successfully.`);
        setUserData((prevData) => ({
          ...prevData,
          loanList: prevData.loanList.map((loan) =>
            loan.book === bookTitle ? { ...loan, isReturned: true } : loan
          ),
        }));
      } else {
        toast.error(response.message || "Error returning the book.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRoleChange = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log("🚀 ~ handleRoleChange ~ selectedRole:", selectedRole)
      const response = await fetchData(
        `/users/update/${userData.email}`,
        "PUT",
        { attribute: "role", newAttribute: selectedRole, image: null },
        token
      );

      if (response.success) {
        toast.success(`Role changed to "${selectedRole}" successfully.`);
        setShowModal(false);
        setUserData((prevData) => ({
          ...prevData,
          role: selectedRole,
        }));
      } else {
        toast.error(response.message || "Error changing role.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="container my-5">
      <section className="card p-4 mb-4 shadow">
        <div className="card-body">
          <p>
            <strong>Username:</strong> {userData?.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email || "N/A"}
          </p>
          <p>
            <strong>Birth Date:</strong> {userData?.birthday || "N/A"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {typeof userData?.role === "string"
              ? userData.role.toLowerCase()
              : "N/A"}
          </p>
          {userRole === "ADMIN" && (
            <button
              className="btn btn-warning"
              onClick={() => setShowModal(true)}
            >
              Change Role
            </button>
          )}
        </div>
      </section>

      <ChangeRoleModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleRoleChange={handleRoleChange}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <section className="card p-4 mb-4 shadow">
        <div className="card-body">
          <h3 className="mb-3">Reservations</h3>
          {userData?.reservationList?.length > 0 ? (
            <div className="row">
              {userData.reservationList.map((reservation, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <i className="bi bi-calendar-check me-2"></i>
                      Reservation {index + 1}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No reservations found.</p>
          )}
        </div>
      </section>

      <section className="card p-4 shadow">
        <div className="card-body">
          <h3 className="mb-3">Loans</h3>
          {userData?.loanList?.length > 0 ? (
            <div className="row">
              {userData.loanList.map((loan, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm d-flex justify-content-between align-items-center p-2">
                    <div>
                      <i className="bi bi-book me-2"></i>
                      {loan.book}
                    </div>
                    {!loan.isReturned && (
                      <button
                        className="btn btn-primary btn-sm ms-2 my-2"
                        onClick={() =>
                          handleReturnBook(loan.book, userData.email)
                        }
                      >
                        Return
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No loans found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ViewProfile;