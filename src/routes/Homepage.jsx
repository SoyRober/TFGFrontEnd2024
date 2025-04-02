import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import CreateBookModal from "../components/modals/CreateBookModal.jsx";
import { fetchData } from "../utils/fetch.js";
import Loading from "../components/Loading.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

export default function Homepage() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookData, setBookData] = useState({
    title: "",
    authors: [],
    genres: [],
    quantity: "",
    location: "",
    synopsis: "",
    publicationDate: "",
    isAdult: false,
    libraryId: 1,
    image: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTermTitle, setSearchTermTitle] = useState("");
  const [searchTermAuthor, setSearchTermAuthor] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [cardSize, setCardSize] = useState(
    () => localStorage.getItem("cardSize") || "medium"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  // Efectos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = JSON.parse(atob(token.split(".")[1])).role.toLowerCase();
      if (userRole !== "user") setHasPermissions(true);
    }
  }, []);

  useEffect(() => {
    fetchBooksData(page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop + windowHeight >= documentHeight - 5 && !isFetching) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    setBooks([]);
    setPage(0);
    fetchBooksData(0, startDateFilter ? startDateFilter.getFullYear() : null);
  }, [startDateFilter, searchTermTitle, searchTermAuthor]);

  // Funciones
  const fetchBooksData = useCallback(
    async (page, year = null) => {
      if (isFetching) return;
      setIsFetching(true);

      try {
        const params = new URLSearchParams({ page, size: "10" });

        if (searchTermTitle.length > 2)
          params.append("bookName", searchTermTitle);
        if (searchTermAuthor.length > 2)
          params.append("authorName", searchTermAuthor);
        if (year !== null) params.append("date", year);

        const url = `/books/filter?${params.toString()}`;
        const data = await fetchData(url);

        if (!data || data.length === 0) {
          toast.info("No more books to load.");
          return;
        }

        setBooks((prevBooks) =>
          page === 0
            ? data
            : [
                ...prevBooks,
                ...data.filter(
                  (book) => !prevBooks.some((b) => b.title === book.title)
                ),
              ]
        );
      } catch (error) {
        toast.info(error.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [isFetching, searchTermTitle, searchTermAuthor]
  );

  const fetchAuthors = async (searchString) => {
    try {
      const data = await fetchData(`/authors/search?search=${searchString}`);
      setAuthors(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch authors.");
      setAuthors([]);
    }
  };

  const fetchGenres = async (searchString) => {
    try {
      const data = await fetchData(`/genres/search?search=${searchString}`);
      setGenres(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch genres.");
      setGenres([]);
    }
  };

  const openModal = () => {
    fetchAuthors("");
    fetchGenres("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBookData({
      title: "",
      authors: [],
      genres: [],
      quantity: "",
      location: "",
      synopsis: "",
      publicationDate: "",
      isAdult: false,
      libraryId: 1,
      image: "",
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData("/books", "POST", bookData, token);

      if (!response.success) {
        toast.error(response.message || "Failed to create book.");
        return;
      }

      toast.success("Book created successfully.");
      closeModal();
      fetchBooksData(0);
    } catch (error) {
      toast.error(error.message || "An unknown error occurred.");
    }
  };

  const resetStartDateFilter = () => {
    setStartDateFilter("");
    fetchBooksData(0);
  };

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

  const navigateToBookDetails = (title) => {
    navigate(`/viewBook/${encodeURIComponent(title)}`);
  };

  // Renderizado
  return (
    <main className="fade-in d-flex flex-column justify-content-center align-items-center">
      <CreateBookModal
        showModal={showModal}
        closeModal={closeModal}
        handleSave={handleSave}
        bookData={bookData}
        setBookData={setBookData}
        authors={authors}
        genres={genres}
      />

      <header className="container text-center">
        <h1 className="mb-4">Book List</h1>

        {hasPermissions && (
          <button className="btn btn-primary mb-3" onClick={openModal}>
            Create New Book
          </button>
        )}

        <section className="row w-100 justify-content-center mb-4">
          <div className="col-12 col-md-6 col-lg-4">
            <fieldset className="btn-group w-100">
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "small" ? "active" : ""
                }`}
                onClick={() => setCardSize("small")}
              >
                Small
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "medium" ? "active" : ""
                }`}
                onClick={() => setCardSize("medium")}
              >
                Medium
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  cardSize === "large" ? "active" : ""
                }`}
                onClick={() => setCardSize("large")}
              >
                Large
              </button>
            </fieldset>
          </div>
        </section>

        <section className="mb-3">
          <DatePicker
            selected={startDateFilter}
            onChange={(date) => setStartDateFilter(date)}
            className="form-control"
            dateFormat="yyyy"
            placeholderText="Select a year"
            showYearPicker
          />
          <button
            className="btn btn-secondary mt-2"
            onClick={resetStartDateFilter}
          >
            Reset
          </button>
        </section>

        <section className="row w-100 justify-content-center">
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search books..."
              value={searchTermTitle}
              onChange={(e) => setSearchTermTitle(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by author"
              value={searchTermAuthor}
              onChange={(e) => setSearchTermAuthor(e.target.value)}
            />
          </div>
        </section>
      </header>

      <section className="container mt-5">
        <div className="row">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.title}
                className={`${getColumnClass(cardSize)} mb-4`}
              >
                <article
                  className="card customized-card p-1"
                  onClick={() => navigateToBookDetails(book.title)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigateToBookDetails(book.title)
                  }
                  style={{
                    height:
                      cardSize === "small"
                        ? "250px"
                        : cardSize === "medium"
                        ? "350px"
                        : "600px",
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
                      alt={book.title}
                      className="img-fluid"
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                      <hr
                        className="my-1"
                        style={{ borderTop: "1px solid black", width: "80%" }}
                      />
                    </div>
                  <div className="card-body">
                    <h5 className="card-title text-center">{book.title}</h5>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </section>
    </main>
  );
}
