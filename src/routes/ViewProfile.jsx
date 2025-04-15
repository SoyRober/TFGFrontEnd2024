import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ChangeRoleModal from "../components/modals/changeRoleModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading.jsx";

const ViewProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  const [userReservations, setUserReservations] = useState([]);
  const [reservationPage, setReservationPage] = useState(0);
  const [dateFilterReservation, setDateFilterReservation] = useState("");
  const [titleFilterReservation, setTitleFilterReservation] = useState("");

  const [userLoans, setUserLoans] = useState([]);
  const [loanPage, setLoanPage] = useState(0);
  const [hasMoreLoans, setHasMoreLoans] = useState(true);

  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreReservations, setHasMoreReservations] = useState(true);
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
          `/users/info/profile/${email}`,
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
    setReservationPage(0);
    setHasMoreReservations(true);

    fetchUserReservations(0, dateFilterReservation, titleFilterReservation); // <-- esta línea es clave
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
        `/users/info/reservation/${email}?${queryParams.toString()}`,
        "GET",
        null,
        token
      );

      const newReservations = data.message;

      if (newReservations.length === 0) {
        setHasMoreReservations(false);
      } else {
        setUserReservations((prev) => [...prev, ...newReservations]);
        setReservationPage((prev) => prev + 1);
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

    fetchUserLoans(loanPage, "", "");
  }, [email]);

  const fetchUserLoans = async (page, date, title) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, user might not be authenticated");
      return navigate("/");
    }

    try {
      setIsFetching(true);

      const data = await fetchData(
        `/users/info/loan/${email}?page=${loanPage}`,
        "GET",
        null,
        token
      );
      console.log("🚀 ~ fetchUserLoans ~ data:", data);

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
    try {
      const response = await fetchData(
        `/users/update/${userProfile.email}`,
        "PUT",
        { attribute: "role", newAttribute: selectedRole, image: null },
        token
      );

      if (response.success) {
        toast.success(`Role changed to "${selectedRole}" successfully.`);
        setShowModal(false);
        setUserReservations((prevData) => ({
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

      {/* TODO: QUITAR SCROLL HORIZONTAL */}
      <section className="card p-4 mb-4 shadow">
        <h3 className="mb-3">Reservations</h3>

        {/* Filtros de búsqueda */}
        <div className="mb-3">
          <input
            type="date"
            className="form-control mb-2"
            value={dateFilterReservation}
            onChange={(e) => setDateFilterReservation(e.target.value)}
            placeholder="Filter by date"
          />
          <input
            type="text"
            className="form-control"
            value={titleFilterReservation}
            onChange={(e) => setTitleFilterReservation(e.target.value)}
            placeholder="Filter by title"
          />
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

      <section className="card p-4 shadow">
        <div className="card-body">
          <h3 className="mb-3">Loans</h3>
          <div className="mb-3">
            <InfiniteScroll
              dataLength={userReservations.length}
              next={() =>
                fetchUserLoans(
                  reservationPage,
                  dateFilterReservation,
                  titleFilterReservation
                )
              }
              loader={isFetching && <Loading />}
              hasMore={hasMoreLoans}
              endMessage={
                <p className="text-center mt-3 text-muted">
                  There aren't more loans
                </p>
              }
            >
              <div className="row" style={{height: "500px", overflowY: "auto"}}>
                {userLoans.map((loan, index) => (
                  <article key={index} className="col-md-6 mb-3">
                    <div className="card shadow-sm d-flex justify-content-between align-items-center p-2">
                      <div>
                        <i className="bi bi-book me-2"></i>
                        {loan.book}
                        {!loan.isReturned && (
                          <button
                            className="btn btn-primary btn-sm ms-2 my-2"
                            onClick={() =>
                              handleReturnBook(loan.book, userProfile.email)
                            }
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewProfile;
