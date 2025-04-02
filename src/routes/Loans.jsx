import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";

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

  // Fetch loans data
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
        `/getUserLoans?page=${page}&size=10&title=${filters.title}&isReturned=${
          filters.returned !== "notReturned"
        }&startDate=${formattedStartDate}`,
        "GET",
        null,
        token
      );

      console.log(data)

      if (data.success) {
        setLoans((prevLoans) =>
          page === 0 ? data.message : [...prevLoans, ...data.message]
        );
        if (data.message.length === 0 && page === 0) {
          toast.info("No loans found.");
        }
      } else {
        toast.error(data.message || "An error occurred while fetching loans");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching loans");
    }
  }, [filters, page, token, navigate]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop + windowHeight >= documentHeight - 5) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch loans on filters or page change
  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  // Reset filters
  const resetFilters = () => {
    setFilters({ startDate: "", title: "", returned: "notReturned" });
    setPage(0);
  };

  // Handle book return
  const handleReturnBook = async (bookTitle) => {
    try {
      const response = await fetchData(
        "/return",
        "PUT",
        { title: bookTitle },
        token
      );
      if (response.ok) {
        setLoans((prevLoans) =>
          prevLoans.map((loan) =>
            loan.book === bookTitle ? { ...loan, isReturned: true } : loan
          )
        );
        toast.success(`The book "${bookTitle}" has been returned`);
      } else {
        toast.error(
          response.message || "An error occurred while returning the book"
        );
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while returning the book");
    }
  };

  // Get column class based on card size
  const getColumnClass = (size) => {
    switch (size) {
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
    <main className="container mt-5">
      {/* Filters Section */}
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
            className="form-control form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a start date"
            id="startDateFilter"
          />
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={() => setFilters((prev) => ({ ...prev, startDate: "" }))}
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
            className="form-control form-control"
            placeholder="Name or surname"
            value={filters.title}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={() => setFilters((prev) => ({ ...prev, title: "" }))}
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
            className="form-select form-select"
            value={filters.returned}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, returned: e.target.value }))
            }
          >
            <option value="returned">Returned</option>
            <option value="notReturned">Not Returned</option>
          </select>
          <button
            className="btn btn-outline-secondary btn ms-2"
            onClick={() =>
              setFilters((prev) => ({ ...prev, returned: "notReturned" }))
            }
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <button className="btn btn-warning btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </section>

      {/* Loans Section */}
      <section className="container mt-5">
        <div className="row">
          {loans.length > 0 ? (
            loans.map((loan, index) => (
              <article
                key={index}
                className={`${getColumnClass(cardSize)} mb-4`}
              >
                <div className="card h-100 p-1">
                  <img
                    src={`data:image/jpeg;base64,${loan.bookImage}`}
                    className="card-img-top"
                    alt={`Cover of ${loan.book}`}
                  />
                  <div className="d-flex justify-content-center">
                    <hr
                      className="my-1"
                      style={{ borderTop: "1px solid black", width: "80%" }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title">
                      <Link
                        to={`/viewBook/${loan.book}`}
                        className="text-decoration-none"
                      >
                        {loan.book}
                      </Link>
                    </h5>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(loan.startDate).toLocaleDateString("es-ES")}
                    </p>
                    <p>
                      <strong>Return Date:</strong>{" "}
                      {loan.returnDate
                        ? new Date(loan.returnDate).toLocaleDateString("es-ES")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Returned:</strong>{" "}
                      {loan.isReturned ? "Yes" : "No"}
                      {!loan.isReturned && (
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => handleReturnBook(loan.book)}
                        >
                          Return
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </section>
    </main>
  );
};

export default Loans;
