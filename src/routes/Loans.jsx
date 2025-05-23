import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
const Loading = lazy(() => import("../components/Loading.jsx"));
const BookCardLoans = lazy(() => import("../components/cards/BookCardsLoan.jsx"));
const ResetButtonFilter = lazy(() =>
  import("../components/ResetButtonFilter.jsx")
);

const Loans = ({ cardSize = "medium" }) => {
  const [loans, setLoans] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    title: "",
    returned: "notReturned",
  });
  const [page, setPage] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchLoans = useCallback(async () => {
    if (!token) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }

    try {
      const formattedStartDate = filters.startDate
        ? new Date(filters.startDate).toISOString().split("T")[0]
        : "";

      const data = await fetchData(
        `/user/loans/getUserLoans?page=${page}&size=10&title=${
          filters.title
        }&isReturned=${
          filters.returned !== "notReturned"
        }&startDate=${formattedStartDate}`,
        "GET",
        null,
        token
      );

      if (data.success) {
        if (page === 0 && data.message.length === 0) {
          toast.info("No loans found.");
        }

        setLoans((prevLoans) =>
          page === 0 ? data.message : [...prevLoans, ...data.message]
        );
      } else {
        toast.error(data.message || "An error occurred while fetching loans");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching loans");
    }
  }, [filters, page, token, navigate]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const resetFilters = () => {
    setFilters({ startDate: "", title: "", returned: "notReturned" });
    setPage(0);
  };

  return (
    <main className="container mt-5" role="main">
      <section
        className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3"
        aria-label="Filter loan records"
      >
        <div className="d-flex align-items-center">
          <label htmlFor="startDateFilter" className="me-2">
            Date:
          </label>
          <input
            type="date"
            id="startDateFilter"
            value={
              filters.startDate
                ? filters.startDate.toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                startDate: e.target.value ? new Date(e.target.value) : null,
              }))
            }
            className="form-control"
            aria-describedby="startDateHelp"
          />
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, startDate: "" }));
              fetchLoans(0);
            }}
            ariaLabel="Reset Date Button"
          />
        </div>

        <div className="d-flex align-items-center">
          <label htmlFor="titleFilter" className="me-2">
            Title:
          </label>
          <input
            type="text"
            id="titleFilter"
            className="form-control"
            placeholder="Name or surname"
            value={filters.title}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, title: e.target.value }))
            }
            aria-describedby="titleHelp"
          />
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, title: "" }));
              fetchLoans(0);
            }}
            ariaLabel="Reset Title Button"
          />
        </div>

        <div className="d-flex align-items-center">
          <label htmlFor="returnedFilter" className="me-2">
            Status:
          </label>
          <select
            id="returnedFilter"
            className="form-select"
            value={filters.returned}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, returned: e.target.value }))
            }
            aria-describedby="returnStatusHelp"
          >
            <option value="returned">Returned</option>
            <option value="notReturned">Not Returned</option>
          </select>
          <ResetButtonFilter
            onClick={() => {
              setFilters((prev) => ({ ...prev, returned: "notReturned" }));
              fetchLoans(0);
            }}
            ariaLabel="Reset Status Button"
          />
        </div>
      </section>

      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-warning"
          onClick={resetFilters}
          aria-label="Clear all filters"
        >
          Reset Filters
        </button>
      </div>

      <section
        className="container mt-5"
        aria-label="Loan results"
        aria-live="polite"
      >
        <InfiniteScroll
          dataLength={loans.length}
          next={() => setPage((prev) => prev + 1)}
          hasMore={loans.length % 30 === 0 && loans.length > 0}
          loader={<Loading />}
          endMessage={
            <p className="text-center mt-4 text-muted" role="status">
              There aren't more loans
            </p>
          }
          style={{ overflow: "hidden" }}
        >
          <div className="row" role="list">
            {loans.map((loan) => (
              <Suspense
                fallback={<Loading />}
                key={`${loan.id}-${loan.startDate}`}
              >
                <BookCardLoans
                  loan={loan}
                  cardSize={cardSize}
                  role="listitem"
                />
              </Suspense>
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
};

export default Loans;
