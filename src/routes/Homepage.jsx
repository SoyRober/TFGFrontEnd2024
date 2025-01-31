import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import CreateBookModal from "../components/CreateBookModal";
import Notification from "../components/Notification";
import { jwtDecode } from "jwt-decode";
import { fetchData } from "../utils/fetch.js";
import Loading from "../components/Loading.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Homepage() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthors, setBookAuthors] = useState([]);
  const [bookGenres, setBookGenres] = useState([]);
  const [bookQuantity, setBookQuantity] = useState("");
  const [bookLocation, setBookLocation] = useState("");
  const [bookSynopsis, setBookSynopsis] = useState("");
  const [bookPublicationDate, setBookPublicationDate] = useState("");
  const [bookIsAdult, setBookIsAdult] = useState(false);
  const [bookImage, setBookImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchStringAuthors, setSearchStringAuthors] = useState("");
  const [searchStringGenres, setSearchStringGenres] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [atBottom, setAtBottom] = useState(false);
  const [page, setPage] = useState(0);
  const [extraBottomSpace, setExtraBottomSpace] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [cardSize, setCardSize] = useState(() => {
    return localStorage.getItem("cardSize")
      ? localStorage.getItem("cardSize")
      : "medium";
  });
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
        setHasPermissions(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchBooksData(page);
  }, [page]);

  useEffect(() => {
    setCardSize(cardSize);
  }, [cardSize]);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop + windowHeight >= documentHeight - 5 && !atBottom) {
        setAtBottom(true);
        fetchBooksData(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [atBottom, page]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  useEffect(() => {
    if (startDateFilter) {
      const year = startDateFilter.getFullYear();
      fetchBooksData(0, year);
    }
  }, [startDateFilter]);

  useEffect(() => {
    if (isFetching) {
      console.log("🚀 ~ isFetching timer...");
      const timer = setTimeout(() => {
        setIsFetching((prev) => {
          return false;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isFetching]);
  useEffect(() => {
    console.log("🚀 ~ isFetching has changed:", isFetching);
  }, [isFetching]);

  const fetchBooksData = async (page, dateFilter = null) => {
    if (isFetching) {
      console.log("🚀 ~ isFetching already!", isFetching);
      return;
    }
    setIsFetching(true);
    console.log("🚀 ~ isFetching set true");

    try {
      const baseUrl = `/getFilteredBooks?page=${page}&size=10`;
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("bookName", searchTerm);
      }

      if (dateFilter) {
        params.append("date", dateFilter);
      }
      const url = `${baseUrl}&${params.toString()}`;
      const data = await fetchData(url);

      setBooks((prevBooks) =>
        page === 0 ? data.books : [...prevBooks, ...data.books]
      ); // Reset books array if page is 0
      setPage(page);
      setExtraBottomSpace(extraBottomSpace + cardSize / 7);
      setAtBottom(false); // Move this line here to ensure it's set after fetching
    } catch (error) {
      setNotificationMessage(error.message);
      setNotificationKey((prevKey) => prevKey + 1);
      setAtBottom(false); // Ensure atBottom is reset in case of error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthors = async (token, searchString) => {
    try {
      const data = await fetchData(
        "/searchAuthors",
        "POST",
        searchString,
        token,
        "text/plain"
      );
      setAuthors(data);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      setAuthors([]);
    }
  };

  const fetchGenres = async (token, searchString) => {
    try {
      const data = await fetchData(
        "/searchGenres",
        "POST",
        searchString,
        token,
        "text/plain"
      );
      setGenres(data);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      setGenres([]);
    }
  };

  const navigateToBookDetails = (title) => {
    navigate(`/viewBook/${encodeURIComponent(title)}`);
  };

  const handleAuthorChange = (e) => {
    const selectedAuthors = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setBookAuthors(selectedAuthors);
  };

  const handleGenreChange = (e) => {
    const selectedGenres = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setBookGenres(selectedGenres);
  };

  const handleAuthorsSearchChange = (e) => {
    setSearchStringAuthors(e.target.value);
    const token = localStorage.getItem("token");
    fetchAuthors(token, e.target.value);
  };

  const handleGenresSearchChange = (e) => {
    setSearchStringGenres(e.target.value);
    const token = localStorage.getItem("token");
    fetchGenres(token, e.target.value);
  };

  const openModal = () => {
    const token = localStorage.getItem("token");
    fetchAuthors(token, searchStringAuthors);
    fetchGenres(token, searchStringGenres);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    clearForm();
  };

  const clearForm = () => {
    setBookTitle("");
    setBookAuthors([]);
    setBookGenres([]);
    setBookQuantity("");
    setBookLocation("");
    setBookSynopsis("");
    setBookPublicationDate("");
    setBookIsAdult(false);
    setBookImage("");
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const bookData = {
      title: bookTitle,
      authors: bookAuthors,
      genres: bookGenres,
      quantity: bookQuantity,
      location: bookLocation,
      synopsis: bookSynopsis,
      publicationDate: bookPublicationDate,
      isAdult: bookIsAdult,
      image: bookImage,
    };

    try {
      const response = await fetchData("/saveBook", "POST", bookData, token);

      if (!response.success) {
        const errorMessage = response.message || "Failed to save book.";
        setNotificationMessage(errorMessage);
        setNotificationKey(notificationKey + 1);
        return;
      }

      setNotificationMessage(response.message || "Book saved successfully.");
      setNotificationKey(notificationKey + 1);
      fetchBooksData(page);
    } catch (error) {
      console.error("Failed to save book:", error);
      setNotificationMessage(error.message || "An unknown error occurred.");
      setNotificationKey(notificationKey + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (startDateFilter) {
      fetchBooksData(0, startDateFilter.getFullYear());
    } else {
      fetchBooksData(0);
    }
  }, [searchTerm]);

  const resetStartDateFilter = () => {
    setStartDateFilter("");
    fetchBooksData(0);
  };

  useEffect(() => {
    if (startDateFilter) {
      const year = startDateFilter.getFullYear();
      fetchBooksData(0, year);
    } else {
      fetchBooksData(0);
    }
  }, [startDateFilter]);

  const getColumnClass = (cardSize) => {
    localStorage.setItem("cardSize", cardSize);
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

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  return (
    <main
      className="fade-in d-flex flex-column justify-content-center align-items-center"
      style={{
        paddingBottom: `${extraBottomSpace}px`,
        width: "100%",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      {notificationMessage && (
        <section className="mb-4 text-center d-flex justify-content-left">
          <Notification key={notificationKey} message={notificationMessage} />
        </section>
      )}

      <CreateBookModal
        {...{
          showModal,
          closeModal,
          handleSave,
          bookTitle,
          setBookTitle,
          bookAuthors,
          setBookAuthors,
          authors,
          searchStringAuthors,
          setSearchStringAuthors,
          handleAuthorsSearchChange,
          handleAuthorChange,
          bookGenres,
          setBookGenres,
          genres,
          searchStringGenres,
          setSearchStringGenres,
          handleGenresSearchChange,
          handleGenreChange,
          bookQuantity,
          setBookQuantity,
          bookLocation,
          setBookLocation,
          bookSynopsis,
          setBookSynopsis,
          bookPublicationDate,
          setBookPublicationDate,
          bookIsAdult,
          setBookIsAdult,
          setBookImage,
          notificationMessage,
          notificationKey,
        }}
      />

      <header
        className="container text-center d-flex flex-column align-items-center justify-content-center"
        style={{ height: "50vh", padding: "10px" }}
      >
        <h1 className="mb-4">Book List</h1>

        {hasPermissions && (
          <button
            className="btn btn-primary mb-3"
            onClick={openModal}
            style={{ width: "100%", maxWidth: "300px" }}
          >
            Create New Book
          </button>
        )}

        <section className="row w-100 justify-content-center mb-4">
          <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <div
              className="btn-group w-100"
              role="group"
              aria-label="Card size selector"
            >
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "small" ? "active" : ""
                }`}
                onClick={() => setCardSize("small")}
              >
                Pequeño
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "medium" ? "active" : ""
                }`}
                onClick={() => setCardSize("medium")}
              >
                Mediano
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "large" ? "active" : ""
                }`}
                onClick={() => setCardSize("large")}
              >
                Grande
              </button>
            </div>
          </div>
        </section>

        <section className="mb-3">
          <div className="d-flex align-items-center">
            <DatePicker
              selected={startDateFilter}
              onChange={(date) => setStartDateFilter(date)}
              className="form-control"
              dateFormat="yyyy"
              placeholderText="Select a year"
              id="startDateFilter"
              showYearPicker
              style={{ zIndex: 100, width: "100%", maxWidth: "300px" }}
            />
            <button
              className="btn btn-secondary mt-2 w-100"
              onClick={resetStartDateFilter}
              style={{ maxWidth: "100px", marginLeft: "10%" }}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="row w-100 justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </section>
      </header>

      <section className="container mt-5">
        <div className="row">
          {!isLoading ? (
            books.map((book) => {
              return (
                <div
                  key={book.title}
                  className={`${getColumnClass(cardSize)} mb-4`}
                >
                  <article
                    className="card customized-card"
                    onClick={() => navigateToBookDetails(book.title)}
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigateToBookDetails(book.title);
                      }
                    }}
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
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "60%",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          book.image
                            ? `data:image/jpeg;base64,${book.image}`
                            : "placeholder-image-url"
                        }
                        className="img-fluid"
                        alt={book.title}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    </div>

                    <div className="d-flex justify-content-center">
                      <hr
                        className="my-0"
                        style={{ borderTop: "1px solid black", width: "80%" }}
                      />
                    </div>

                    <div className="card-body">
                      <h5 className="card-title text-center my-4">
                        {book.title}
                      </h5>
                    </div>
                  </article>
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </section>
    </main>
  );
}
