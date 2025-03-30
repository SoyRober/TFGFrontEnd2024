import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserReservations = ({ cardSize }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [loanedFilter, setReturnedFilter] = useState("all");
  const [atBottom, setAtBottom] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("No token found, user might not be authenticated");
      setNotificationKey((prevKey) => prevKey + 1);
      navigate("/login");
      return;
    }

    fetchReservations();
  }, [page, token, navigate]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...reservations];

      if (dateFilter) {
        const formattedDate = new Date(dateFilter).toLocaleDateString();
        result = result.filter(
          (reservation) =>
            new Date(reservation.reservationDate).toLocaleDateString() ===
            formattedDate
        );
      }

      if (loanedFilter !== "all") {
        const isLoaned = loanedFilter === "returned";
        result = result.filter(
          (reservation) => reservation.isLoaned === isLoaned
        );
      }

      console.log("🚀 ~ applyFilters ~ result:", result);

      setFilteredReservations(result);
    };

    applyFilters();
  }, [dateFilter, loanedFilter, reservations]);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop + windowHeight >= documentHeight - 5) {
        if (!atBottom && !loading) {
          setAtBottom(true);
          setPage((prevPage) => prevPage + 1);
          fetchReservations();
        }
      }
    };

    console.log("He pasado por aquí");

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [atBottom, loading]);

  const fetchReservations = async () => {
    try {
      const data = await fetchData(
        `/getUserReservations?page=${page}&size=10`,
        "GET",
        null,
        token
      );
      setReservations((prevReservations) => {
        const newReservations = data.filter(
          (newReservation) =>
            !prevReservations.some(
              (reservation) =>
                reservation.reservationId === newReservation.reservationId
            )
        );

        return [...prevReservations, ...newReservations];
      });

      if (data.length === 0) {
        setMessage("No hay más libros por cargar.");
      }
    } catch (error) {
      setMessage(error.message);
      console.log(error.message)
    } finally {
      setAtBottom(false);
    }
  };

  const resetDateFilter = () => setDateFilter("");
  const resetReturnedFilter = () => setReturnedFilter("all");

  const resetAllFilters = () => {
    setDateFilter("");
    setReturnedFilter("all");
  };

  const handleLoanBook = async (title) => {
    if (!localStorage.getItem("token")) return;

    try {
      await fetchData("/loan", "POST", title, token, "text/plain");
      const updatedReservations = reservations.map((reservation) => {
        if (
          reservation.bookTitle === title &&
          !reservation.isLoaned
        ) {
          return {
            ...reservation,
            isLoaned: true,
          };
        }
        return reservation;
      });

      setReservations(updatedReservations);
    } catch (error) {
      console.error(error.message);
    }
  };

  const cancelReservation = async (title) => {
    if (!localStorage.getItem("token")) return;

    try {
      await fetchData(`/cancelReservation?title=${encodeURIComponent(title)}`, "POST", null, token);
      const updatedReservations = reservations.filter(
        (reservation) => reservation.bookTitle !== title
      );

      setReservations(updatedReservations);
    } catch (error) {
      console.error(error.message);
    }
  };


  const getColumnClass = (cardSize) => {
    switch (cardSize) {
      case "small":
        return "col-12 col-sm-6 col-md-4 col-lg-3";
      case "medium":
        return "col-12 col-sm-6 col-md-6 col-lg-4";
      case "large":
        return "col-12 col-md-6";
      default:
        return "col-12";
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="container mt-5">
      <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center">
          <label htmlFor="startDateFilter" className="me-2">
            Date:
          </label>
          <DatePicker
            selected={dateFilter}
            onChange={(date) => setDateFilter(date)}
            className="form-control form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            id="startDateFilter"
          />
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={resetDateFilter}
          >
            ⟲
          </button>
        </div>

        <div className="d-flex align-items-center">
          <label htmlFor="returnedFilter" className="me-2">
            Status:
          </label>
          <select
            id="loanedFilter"
            className="form-select form-select"
            value={loanedFilter}
            onChange={(e) => setReturnedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="returned">Loaned</option>
            <option value="notReturned">Not loaned</option>
          </select>
          <button
            className="btn btn-outline-secondary btn ms-2"
            onClick={resetReturnedFilter}
          >
            ⟲
          </button>
        </div>

        <button className="btn btn-warning btn" onClick={resetAllFilters}>
          Reset Filters
        </button>
      </div>

      <div className="container mt-5">
        <div className="row">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation, index) => (
              <article
                key={index}
                className={`${getColumnClass(cardSize)} mb-4`}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/viewBook/${reservation.bookTitle}`);
                  }
                }}
              >
                <div
                  className="card"
                  style={{
                    height:
                      cardSize === "small"
                        ? "250px"
                        : cardSize === "medium"
                        ? "350px"
                        : "600px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="card-img-container"
                    style={{
                      flex: "1 0 40%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "4%",
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${reservation.image}`}
                      className="img-fluid"
                      alt={`Cover of ${reservation.bookTitle}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    className="card-body"
                    style={{ flex: "1 0 40%", overflowY: "auto" }}
                  >
                    <h5 className="card-title" tabIndex="-1">
                      <Link
                        to={`/viewBook/${reservation.bookTitle}`}
                        className="text-decoration-none d-flex align-items-center"
                      >
                        {reservation.bookTitle}
                        <i
                          className="fas fa-mouse-pointer ms-2"
                          title="Click to view details"
                        ></i>
                      </Link>
                    </h5>
                    <p className="card-text">
                      <strong>Reservation Date:</strong>{" "}
                      {new Date(reservation.reservationDate).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong>{" "}
                      {reservation.isLoaned ? "Loaned" : "Not loaned"}
                    </p>
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => cancelReservation(reservation.bookTitle)}
                      >
                        Cancel Reservation
                      </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="alert alert-info" role="alert">
              No reservations found
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserReservations;
