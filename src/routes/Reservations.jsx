import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import Loading from "../components/Loading.jsx";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
const ResetButtonFilter = lazy(() => import("../components/ResetButtonFilter.jsx"));
import ReservationCard from "../components/cards/BookCardReservation.jsx";

const UserReservations = ({ cardSize }) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loanedFilter, setLoanedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("No token found");
      navigate("/login");
      return;
    }

    fetchReservations();
  }, [page]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  useEffect(() => {
    let result = [...reservations];

    if (dateFilter) {
      const formattedDate = new Date(dateFilter).toLocaleDateString();
      result = result.filter(
        (r) =>
          new Date(r.reservationDate).toLocaleDateString() === formattedDate
      );
    }

    if (loanedFilter !== "all") {
      const isLoaned = loanedFilter === "returned";
      result = result.filter((r) => r.isLoaned === isLoaned);
    }

    setFilteredReservations(result);
  }, [dateFilter, loanedFilter, reservations]);

  const fetchReservations = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const data = await fetchData(
        `/user/getUserReservations?page=${page}&size=10`,
        "GET",
        null,
        token
      );

      if (data.length !== 0) {
        setReservations((prev) => [
          ...prev,
          ...data.filter(
            (newR) => !prev.some((r) => r.reservationId === newR.reservationId)
          ),
        ]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const cancelReservation = async (title) => {
    try {
      await fetchData(
        `/user/cancelReservation?title=${encodeURIComponent(title)}`,
        "POST",
        null,
        token
      );
      setReservations((prev) => prev.filter((r) => r.bookTitle !== title));
    } catch (error) {
      toast.error(error.message);
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

  return (
    <main className="container mt-5" role="main">
      <div
        className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3"
        role="region"
        aria-label="Reservation filters"
      >
        <div className="d-flex align-items-center">
          <label htmlFor="startDateFilter" className="me-2">
            Date:
          </label>
          <input
            type="date"
            id="startDateFilter"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <ResetButtonFilter
            onClick={() => {
              setDateFilter("");
              fetchReservations(0);
            }}
            ariaLabel="Reset Date Button"
          />
        </div>

        <div className="d-flex align-items-center">
          <label htmlFor="loanedFilter" className="me-2">
            Status:
          </label>
          <select
            id="loanedFilter"
            className="form-select"
            value={loanedFilter}
            onChange={(e) => setLoanedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="returned">Loaned</option>
            <option value="notReturned">Not loaned</option>
          </select>
          <ResetButtonFilter
            onClick={() => {
              setLoanedFilter("");
              fetchReservations(0);
            }}
            ariaLabel="Reset Status Button"
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-warning"
          onClick={() => {
            setDateFilter("");
            setLoanedFilter("all");
            fetchReservations(0);
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="container mt-5">
        <InfiniteScroll
          dataLength={filteredReservations.length}
          next={() => setPage((prev) => prev + 1)}
          hasMore={
            !isFetching &&
            filteredReservations.length % 30 === 0 &&
            filteredReservations.length > 0
          }
          loader={<Loading />}
          endMessage={
            <p className="text-center mt-4 text-muted">
              There aren't more loans
            </p>
          }
          style={{ overflow: "hidden" }}
        >
          <div className="row" role="list">
{filteredReservations.map((reservation, index) => (
  <ReservationCard
    key={index}
    reservation={reservation}
    cardSize={cardSize}
    cancelReservation={cancelReservation}
    getColumnClass={getColumnClass}
  />
))}
          </div>
        </InfiniteScroll>
      </div>
    </main>
  );
};

export default UserReservations;
