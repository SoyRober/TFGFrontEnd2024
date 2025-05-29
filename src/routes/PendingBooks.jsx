import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
import defaultBook from "/img/defaultBook.svg";

export default function Attributes() {
  const [selectedButton, setSelectedButton] = useState("Reserves");
  const [hasPermissions, setHasPermissions] = useState(false);
  const [reserves, setReserves] = useState([]);
  const [loans, setLoans] = useState([]);
  const [token] = useState(() => localStorage.getItem("token") || null);
  const [reservesPage, setReservesPage] = useState(0);
  const [loansPage, setLoansPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentReserve, setCurrentReserve] = useState(null);
  const [daysLoaned, setDaysLoaned] = useState(0);
  const [library, setLibrary] = useState(localStorage.getItem("libraryName"));
  const [apiUnauthorized, setApiUnauthorized] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      if (userRole.toLowerCase() !== "user") {
        setHasPermissions(true);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const handleLibraryChange = () => {
      const currentLibrary = localStorage.getItem("libraryName");
      setLibrary(currentLibrary);
      setReserves([]);
      setLoans([]);
      setReservesPage(0);
      setLoansPage(0);
    };

    window.addEventListener("libraryChanged", handleLibraryChange);
    return () =>
      window.removeEventListener("libraryChanged", handleLibraryChange);
  }, []);

  useEffect(() => {
    if (!hasPermissions || !library) return;
    const fetchReserves = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", loansPage);
        if (username) params.append("username", username);

        const url = `/librarian/getLibraryReservations/${library}?${params.toString()}`;

        const data = await fetchData(url, "GET", null, token);
        if (reservesPage === 0) {
          setReserves(data);
        } else {
          setReserves((prev) => [...prev, ...data]);
        }
      } catch (err) {
        if (err.message && err.message.includes("User is not authorized")) {
          setApiUnauthorized(true);
        } else {
          toast.error("Error loading reservations: " + err.message);
        }
      }
    };
    fetchReserves();
  }, [reservesPage, hasPermissions, library, token, username]);

  useEffect(() => {
    if (!hasPermissions || !library) return;

    const fetchLoans = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", loansPage);
        if (username) params.append("username", username);

        const url = `/librarian/loans/getLibraryLoans/${library}?${params.toString()}`;

        const data = await fetchData(url, "GET", null, token);
        if (loansPage === 0) {
          setLoans(data);
        } else {
          setLoans((prev) => [...prev, ...data]);
        }
      } catch (err) {
        if (err.message && err.message.includes("User is not authorized")) {
          setApiUnauthorized(true);
        } else {
          toast.error("Error loading loans: " + err.message);
        }
      }
    };
    fetchLoans();
  }, [loansPage, username, hasPermissions, library, token]);

  const openLoanModal = (reserve) => {
    setCurrentReserve(reserve);
    setShowModal(true);
  };

  const closeLoanModal = () => {
    setShowModal(false);
    setCurrentReserve(null);
    setDaysLoaned(0);
  };

  const confirmLoan = async () => {
    if (!currentReserve) return;

    try {
      const loanRequest = {
        username: currentReserve.username,
        bookTitle: currentReserve.bookTitle,
        daysLoaned,
      };

      const response = await fetchData(
        `/librarian/loans/loanReserved`,
        "POST",
        loanRequest,
        token
      );

      if (response.success) {
        toast.success("Loan successful");
        setReserves([]);
        setReservesPage(0);
        setLoans([]);
        setLoansPage(0);
      } else {
        toast.error("Loan failed: " + response.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeLoanModal();
    }
  };

  const handleReturn = async (loan) => {
    try {
      const returnRequest = {
        loanId: loan.loanId,
      };
      const response = await fetchData(
        `/librarian/loans/return`,
        "PUT",
        returnRequest,
        token
      );
      if (response.success) {
        toast.success("Return successful");
        setLoans([]);
        setLoansPage(0);
      } else {
        toast.error(response.message || "Return failed");
      }
    } catch (err) {
      toast.error("Return error: " + err.message);
    }
  };

  const fetchMoreReserves = () => {
    setReservesPage((prev) => prev + 1);
  };

  const fetchMoreLoans = () => {
    setLoansPage((prev) => prev + 1);
  };

  if (!hasPermissions) return <h1>UnAuthorized</h1>;
  if (apiUnauthorized)
    return (
      <main className="container text-center mt-5" role="main">
        <h1>You aren't authorized to manage this library</h1>
      </main>
    );

  return (
    <main className="container text-center mt-5" role="main">
      <header className="mb-4">
        <h1 tabIndex={-1}>{library}: Reservations and Loans</h1>
      </header>

      <section
        className="btn-group mb-3"
        role="group"
        aria-label="Reservation and loan selection"
      >
        <button
          type="button"
          className={`btn ${
            selectedButton === "Reserves"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => setSelectedButton("Reserves")}
          aria-pressed={selectedButton === "Reserves"}
        >
          Reserves
        </button>

        <button
          type="button"
          className={`btn ${
            selectedButton === "Loans" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedButton("Loans")}
          aria-pressed={selectedButton === "Loans"}
        >
          Loans
        </button>
      </section>

      <section aria-live="polite">
        {selectedButton === "Reserves" && (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Filter by username"
              aria-label="Filter loans by username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLoans([]);
                setLoansPage(0);
              }}
            />
            <InfiniteScroll
              dataLength={reserves.length}
              next={fetchMoreReserves}
              hasMore={reserves.length > 0 && reserves.length % 10 === 0}
              loader={<Loading />}
              endMessage={
                <p className="text-center mt-3 text-muted">
                  No more reserves to show.
                </p>
              }
            >
              <div className="row">
                {reserves.map((reserve) => {
                  const imageSrc = reserve.image
                    ? `data:image/jpeg;base64,${reserve.image}`
                    : defaultBook;

                  const reservationDate = new Date(reserve.reservationDate);
                  const today = new Date();
                  const diffTime = Math.abs(today - reservationDate);
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <div
                      key={`${reserve.username}-${reserve.bookTitle}`}
                      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                    >
                      <div className="card h-100 shadow-sm">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "150px",
                            backgroundColor: "#f8f9fa",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const formattedTitle = reserve.bookTitle
                              .trim()
                              .replaceAll(" ", "_");
                            navigate(
                              `/viewBook/${encodeURIComponent(formattedTitle)}`
                            );
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details for ${reserve.bookTitle}`}
                        >
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={`Cover of ${reserve.bookTitle}`}
                              className="img-fluid rounded"
                              style={{ maxHeight: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <i
                              className="bi bi-book text-secondary"
                              style={{ fontSize: "2.5rem" }}
                              aria-hidden="true"
                            ></i>
                          )}
                        </div>
                        <div className="card-body text-center">
                          <p className="mb-1">
                            <strong>Reserved by:</strong> {reserve.username}
                          </p>
                          <p className="mb-1">
                            <strong>Title:</strong> {reserve.bookTitle}
                          </p>
                          <p className="mb-2">
                            <strong>Date:</strong>{" "}
                            <span className="mx-1">
                              {new Date(
                                reserve.reservationDate
                              ).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="mb-2">
                            <strong>Days Reserved:</strong> {diffDays}
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => openLoanModal(reserve)}
                            aria-label={`Loan book ${reserve.bookTitle} to ${reserve.username}`}
                          >
                            Loan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </>
        )}

        {selectedButton === "Loans" && (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Filter by username"
              aria-label="Filter loans by username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setLoans([]);
                setLoansPage(0);
              }}
            />
            <InfiniteScroll
              dataLength={loans.length}
              next={fetchMoreLoans}
              hasMore={loans.length > 0 && loans.length % 10 === 0}
              loader={<Loading />}
              endMessage={
                <p className="text-center mt-3 text-muted">
                  No more loans to show.
                </p>
              }
            >
              <div className="row">
                {loans.map((loan) => {
                  const imageSrc = loan.bookImage
                    ? `data:image/jpeg;base64,${loan.bookImage}`
                    : defaultBook;

                  const today = new Date();
                  const returnDate = new Date(loan.returnDate);
                  const remainingDays = Math.floor(
                    (returnDate - today) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={loan.loanId}
                      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                    >
                      <div className="card h-100 shadow-sm">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "150px",
                            backgroundColor: "#f8f9fa",
                          }}
                          onClick={() => {
                            const formattedTitle = loan.book
                              .trim()
                              .replaceAll(" ", "_");
                            navigate(
                              `/viewBook/${encodeURIComponent(formattedTitle)}`
                            );
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View details for ${loan.book}`}
                        >
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={`Cover of ${loan.book}`}
                              className="img-fluid rounded"
                              style={{ maxHeight: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <i
                              className="bi bi-book text-secondary"
                              style={{ fontSize: "2.5rem" }}
                              aria-hidden="true"
                            ></i>
                          )}
                        </div>
                        <div className="card-body text-center">
                          <p className="mb-1">
                            <strong>Loaned by:</strong> {loan.userName}
                          </p>
                          <p className="mb-1">
                            <strong>Title:</strong> {loan.book}
                          </p>
                          <p className="mb-2">
                            <strong>Return Date:</strong>{" "}
                            <span className="mx-1">
                              {new Date(loan.returnDate).toLocaleDateString(
                                "es-ES"
                              )}
                            </span>
                            <small
                              className={`text-muted ${
                                remainingDays <= 0 ? "text-danger" : ""
                              }`}
                            >
                              (
                              {remainingDays > 0
                                ? `${remainingDays} days left`
                                : "Overdue!"}
                              )
                            </small>
                          </p>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReturn(loan)}
                            aria-label={`Return the book titled ${loan.book} loaned by ${loan.userName}`}
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </>
        )}
      </section>

      {showModal && currentReserve && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loanModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <header className="modal-header">
                <h5 className="modal-title" id="loanModalLabel">
                  Loan book "{currentReserve.bookTitle}" to{" "}
                  {currentReserve.username}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeLoanModal}
                ></button>
              </header>
              <div className="modal-body">
                <label htmlFor="daysLoaned" className="form-label">
                  Days loaned
                </label>
                <input
                  type="number"
                  id="daysLoaned"
                  className="form-control"
                  min="1"
                  max="60"
                  value={daysLoaned}
                  onChange={(e) =>
                    setDaysLoaned(parseInt(e.target.value, 10) || 0)
                  }
                  aria-describedby="daysLoanedHelp"
                />
                <div id="daysLoanedHelp" className="form-text">
                  Enter the number of days to loan the book (1-60).
                </div>
              </div>
              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeLoanModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmLoan}
                  disabled={daysLoaned < 1 || daysLoaned > 60}
                >
                  Confirm Loan
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
