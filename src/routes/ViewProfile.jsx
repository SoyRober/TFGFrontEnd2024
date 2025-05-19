import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ChangeRoleModal from "../components/modals/changeRoleModal";
import EditAttributeModal from "../components/modals/EditAttributeModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading.jsx";

const ViewProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  const [userReservations, setUserReservations] = useState([]);
  const [dateFilterReservation, setDateFilterReservation] = useState("");
  const [titleFilterReservation, setTitleFilterReservation] = useState("");

  const [userLoans, setUserLoans] = useState([]);
  const [loanPage, setLoanPage] = useState(0);
  const [hasMoreLoans, setHasMoreLoans] = useState(true);
  const [dateFilterLoan, setDateFilterLoan] = useState("");
  const [titleFilterLoan, setTitleFilterLoan] = useState("");
  const [isReturnedLoan, setIsReturnedLoan] = useState(false);

  const [userRole, setUserRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreReservations, setHasMoreReservations] = useState(true);
  const [editAttributeModal, setEditAttributeModal] = useState({
    show: false,
    attribute: "",
    value: "",
  });
  const [editAttributeError, setEditAttributeError] = useState("");
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
          `/user/users/info/profile/${email}`,
          "GET",
          null,
          token
        );
        setUserProfile(data.message);
      } catch (error) {
        toast.error("Error loading user profile: " + error.message);
      }
    };

    fetchUserProfile();
  }, [email, navigate]);

  useEffect(() => {
    setUserReservations([]);
    setHasMoreReservations(true);

    fetchUserReservations(0, dateFilterReservation, titleFilterReservation);
  }, [email, dateFilterReservation, titleFilterReservation]);

  const fetchUserReservations = async (page, date, title) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, user might not be authenticated");
      return navigate("/");
    }

    try {
      setIsFetching(true);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      if (date) queryParams.append("date", date);
      if (title) queryParams.append("title", title);

      const data = await fetchData(
        `/user/users/info/reservation/${email}?${queryParams.toString()}`,
        "GET",
        null,
        token
      );

      const newReservations = data.message;

      if (newReservations.length === 0) {
        setHasMoreReservations(false);
      } else {
        setUserReservations((prev) => [...prev, ...newReservations]);
      }
    } catch (error) {
      toast.error("Error loading reservations: " + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setUserLoans([]);
    setLoanPage(0);
    setHasMoreLoans(true);

    fetchUserLoans(0, dateFilterLoan, titleFilterLoan, isReturnedLoan);
  }, [email, dateFilterLoan, titleFilterLoan, isReturnedLoan]);

  const fetchUserLoans = async (page, date, title, isReturned) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, user might not be authenticated");
      return navigate("/");
    }

    try {
      setIsFetching(true);

      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      if (date) queryParams.append("date", date);
      if (title) queryParams.append("title", title);
      if (isReturned) queryParams.append("isReturned", isReturned);

      const data = await fetchData(
        `/user/users/info/loan/${email}?page=${page}&${queryParams.toString()}`,
        "GET",
        null,
        token
      );

      const newLoans = data.message;

      if (newLoans.length === 0) {
        setHasMoreLoans(false);
      } else {
        setUserLoans((prev) => [...prev, ...newLoans]);
        setLoanPage((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

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
        toast.success(
          `The book "${bookTitle}" has been returned successfully.`
        );
        setUserReservations((prevData) => ({
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
    const formData = new FormData();
    formData.append("attribute", "role");
    formData.append("newAttribute", selectedRole);

    try {
      const response = await fetchData(
        `/admin/users/update/${userProfile.email}`,
        "PUT",
        formData,
        token
      );

      if (response.success) {
        toast.success(`Role changed to "${selectedRole}" successfully.`);
        setShowRoleModal(false);
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          role: selectedRole,
        }));
      } else {
        toast.error(response.message || "Error changing role.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openEditAttributeModal = (attribute, currentValue = "") => {
    setEditAttributeModal({
      show: true,
      attribute,
      value: currentValue,
    });
    setEditAttributeError("");
  };

  const closeEditAttributeModal = () => {
    setEditAttributeModal({
      show: false,
      attribute: "",
      value: "",
    });
    setEditAttributeError("");
  };

  const handleEditAttributeChange = (e) => {
    setEditAttributeModal((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const handleEditAttributeSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("attribute", editAttributeModal.attribute);
    formData.append("newAttribute", editAttributeModal.value);

    try {
      const response = await fetchData(
        `/admin/users/update/${userProfile.email}`,
        "PUT",
        formData,
        token
      );

      if (response.success) {
        toast.success(
          `${
            editAttributeModal.attribute.charAt(0).toUpperCase() +
            editAttributeModal.attribute.slice(1)
          } changed successfully.`
        );
        const updatedProfile = {
          ...userProfile,
          [editAttributeModal.attribute === "birthdate"
            ? "birthday"
            : editAttributeModal.attribute]: editAttributeModal.value,
        };
        setUserProfile(updatedProfile);
        const wasEmailChange = editAttributeModal.attribute === "email";
        closeEditAttributeModal();
        if (wasEmailChange) {
          const encodedEmail = encodeURIComponent(editAttributeModal.value);
          navigate(`/profile/${encodedEmail}`, { replace: true });
        }
      } else {
        setEditAttributeError(
          response.message || `Error changing ${editAttributeModal.attribute}.`
        );
      }
    } catch (err) {
      setEditAttributeError(err.message);
    }
  };

  return (
    <main className="container my-5" style={{ overflowX: "hidden" }}>
      {/* Información del usuario */}
      <section className="card p-4 mb-4 shadow">
        <div className="card-body">
          <p>
            <strong>Username:</strong> {userProfile?.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userProfile?.email || "N/A"}
          </p>
          <p>
            <strong>Birth Date:</strong> {userProfile?.birthday || "N/A"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {typeof userProfile?.role === "string"
              ? userProfile.role.toLowerCase()
              : "N/A"}
          </p>
          {userRole === "ADMIN" && (
            <>
              <button
                className="btn btn-warning ms-2 m-1"
                onClick={() =>
                  openEditAttributeModal(
                    "username",
                    userProfile?.username || ""
                  )
                }
                aria-label="Change username"
              >
                Change Username
              </button>
              <button
                className="btn btn-warning ms-2 m-1"
                onClick={() =>
                  openEditAttributeModal("email", userProfile?.email || "")
                }
                aria-label="Change user email"
              >
                Change Email
              </button>
              <button
                className="btn btn-warning ms-2 m-1"
                onClick={() =>
                  openEditAttributeModal(
                    "birthdate",
                    userProfile?.birthday || ""
                  )
                }
                aria-label="Change user birth date"
              >
                Change Birth Date
              </button>
              <button
                className="btn btn-warning ms-2 m-1"
                onClick={() => setShowRoleModal(true)}
                aria-label="Change user role"
              >
                Change Role
              </button>
              <button
                className="btn btn-danger ms-2 m-1"
                onClick={() => openEditAttributeModal("password")}
                aria-label="Change user password"
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </section>

      <ChangeRoleModal
        showModal={showRoleModal}
        setShowModal={setShowRoleModal}
        handleRoleChange={handleRoleChange}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        aria-label="Change role modal"
      />

      <EditAttributeModal
        show={editAttributeModal.show}
        onClose={closeEditAttributeModal}
        attribute={editAttributeModal.attribute}
        value={editAttributeModal.value}
        onChange={handleEditAttributeChange}
        placeholder={`Enter new ${editAttributeModal.attribute}`}
        onSave={handleEditAttributeSave}
        errorMessage={editAttributeError}
      />

      {/* Reservas */}
      <section className="card p-4 mb-4 shadow">
        <h3 className="mb-3">Reservations</h3>

        <div className="mb-3 d-flex justify-content-center flex-wrap align-items-end gap-4">
          <div className="d-flex align-items-end gap-2">
            <input
              type="date"
              className="form-control"
              value={dateFilterReservation}
              onChange={(e) => setDateFilterReservation(e.target.value)}
              aria-label="Filter reservations by date"
            />
            <button
              className="btn btn-warning"
              onClick={() => setDateFilterReservation("")}
              aria-label="Reset reservation date filter"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="d-flex align-items-end gap-2">
            <input
              type="text"
              className="form-control"
              value={titleFilterReservation}
              onChange={(e) => setTitleFilterReservation(e.target.value)}
              placeholder="Filter by title"
              aria-label="Filter reservations by title"
            />
            <button
              className="btn btn-warning"
              onClick={() => setTitleFilterReservation("")}
              aria-label="Reset reservation title filter"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        <div
          id="scrollableReservations"
          className="card-body"
          style={{ height: "500px", overflowY: "auto" }}
        >
          <InfiniteScroll
            dataLength={userReservations.length}
            next={() =>
              fetchUserReservations(
                reservationPage,
                dateFilterReservation,
                titleFilterReservation
              )
            }
            loader={isFetching && <Loading />}
            hasMore={hasMoreReservations}
            scrollableTarget="scrollableReservations"
            endMessage={
              <p className="text-center mt-3 text-muted">
                There aren't more reservations
              </p>
            }
          >
            <div className="row">
              {userReservations.map((reservation, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm w-100">
                    <div className="card-body">
                      <i className="bi bi-calendar-check me-2"></i>
                      {reservation.bookTitle} {reservation.id}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </section>

      {/* Préstamos */}
      <section className="card p-4 shadow">
        <h3 className="mb-3">Loans</h3>

        <div className="mb-3 d-flex justify-content-center flex-wrap align-items-end gap-4">
          <div className="d-flex align-items-end gap-2">
            <input
              type="date"
              className="form-control"
              value={dateFilterLoan}
              onChange={(e) => setDateFilterLoan(e.target.value)}
              aria-label="Filter loans by date"
            />
            <button
              className="btn btn-warning"
              onClick={() => setDateFilterLoan("")}
              aria-label="Reset loan date filter"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="d-flex align-items-end gap-2">
            <input
              type="text"
              className="form-control"
              value={titleFilterLoan}
              onChange={(e) => setTitleFilterLoan(e.target.value)}
              placeholder="Filter by title"
              aria-label="Filter loans by title"
            />
            <button
              className="btn btn-warning"
              onClick={() => setTitleFilterLoan("")}
              aria-label="Reset loan title filter"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="d-flex align-items-end gap-2">
            <select
              name="isReturned"
              id="isReturned"
              className="form-select"
              value={isReturnedLoan}
              onChange={(e) => setIsReturnedLoan(e.target.value)}
              aria-label="Filter loans by return status"
            >
              <option value="">All</option>
              <option value="true">Returned</option>
              <option value="false">Not returned</option>
            </select>
            <button
              className="btn btn-warning"
              onClick={() => setIsReturnedLoan("")}
              aria-label="Reset loan return status filter"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        <div
          id="scrollableLoans"
          className="card-body"
          style={{ height: "500px", overflowY: "auto" }}
        >
          <InfiniteScroll
            dataLength={userLoans.length}
            next={() =>
              fetchUserLoans(
                loanPage,
                dateFilterLoan,
                titleFilterLoan,
                isReturnedLoan
              )
            }
            loader={isFetching && <Loading />}
            hasMore={hasMoreLoans}
            scrollableTarget="scrollableLoans"
            endMessage={
              <p className="text-center mt-3 text-muted">
                There aren't more loans
              </p>
            }
          >
            <div className="row">
              {userLoans.map((loan, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm w-100">
                    <div className="card-body">
                      <i className="bi bi-book me-2"></i>
                      {loan.book} {loan.id}
                      <button
                        className="btn btn-primary btn-sm float-end"
                        onClick={() => handleReturnBook(loan.book, email)}
                        aria-label={`Return the book ${loan.book}`}
                      >
                        Return
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </section>
    </main>
  );
};

export default ViewProfile;
