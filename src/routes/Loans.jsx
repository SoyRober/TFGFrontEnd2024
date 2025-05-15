import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import BookCardLoans from "../components/BookCardsLoan.jsx";

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
    <main className="container mt-5">
      <section className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center">
          <label htmlFor="startDateFilter" className="me-2">
            Date:
          </label>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) =>
              setFilters((prev) => ({ ...prev, startDate: date }))
            }
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a start date"
            id="startDateFilter"
            aria-label="Filter loans by start date"
          />
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={() => setFilters((prev) => ({ ...prev, startDate: "" }))}
            aria-label="Reset start date filter"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
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
            aria-label="Filter loans by title"
          />
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={() => setFilters((prev) => ({ ...prev, title: "" }))}
            aria-label="Reset title filter"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
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
            aria-label="Filter loans by return status"
          >
            <option value="returned">Returned</option>
            <option value="notReturned">Not Returned</option>
          </select>
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() =>
              setFilters((prev) => ({ ...prev, returned: "notReturned" }))
            }
            aria-label="Reset return status filter"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <button
          className="btn btn-warning"
          onClick={resetFilters}
          aria-label="Reset all filters"
        >
          Reset Filters
        </button>
      </section>

      <section className="container mt-5">
        <InfiniteScroll
          dataLength={loans.length}
          next={() => setPage((prev) => prev + 1)}
          hasMore={loans.length % 30 === 0 && loans.length > 0}
          loader={<Loading />}
          endMessage={
            <p className="text-center mt-4 text-muted">
              There aren't more loans
            </p>
          }
          style={{ overflow: "hidden" }}
        >
          <div className="row">
            {loans.map((loan, i) => (
              <BookCardLoans
                key={loan.id}
                loan={loan}
                cardSize={cardSize}
                isFirst={i === 0}
              />
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
};

export default Loans;
