import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import CreateBookModal from "../components/modals/CreateBookModal.jsx";
import { fetchData } from "../utils/fetch.js";
import Loading from "../components/Loading.jsx";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import defaultBook from "/img/defaultBook.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import Filters from "../components/BookFilters.jsx";
import CardSizeSelector from "../components/CardSizeSelector.jsx";
import BookCard from "../components/BookCard.jsx";

const initialBookData = {
  title: "",
  authors: [],
  genres: [],
  location: "",
  synopsis: "",
  publicationDate: "",
  isAdult: false,
  libraryId: 1,
  image: "",
  libraries: [],
};

export default function LibraryHomepage() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookData, setBookData] = useState(initialBookData);
  const [showModal, setShowModal] = useState(false);
  const [searchTermTitle, setSearchTermTitle] = useState(
    localStorage.getItem("searchTermTitle") || ""
  );
  const [searchTermAuthor, setSearchTermAuthor] = useState(
    localStorage.getItem("searchTermAuthor") || ""
  );
  const [searchTermGenre, setSearchTermGenre] = useState(
    localStorage.getItem("searchTermGenre") || ""
  );
  const [startDateFilter, setStartDateFilter] = useState(
    localStorage.getItem("startDateFilter")
      ? new Date(localStorage.getItem("startDateFilter"))
      : ""
  );
  const [cardSize, setCardSize] = useState(
    () => localStorage.getItem("cardSize") || "medium"
  );
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [debouncedTitle, setDebouncedTitle] = useState(searchTermTitle);
  const [debouncedAuthor, setDebouncedAuthor] = useState(searchTermAuthor);
  const [debouncedGenre, setDebouncedGenre] = useState(searchTermGenre);
  const [debouncedStartDate, setDebouncedStartDate] = useState(startDateFilter);
  const [library, setLibrary] = useState(localStorage.getItem("libraryName"));
  const [isAdultUser, setIsAdultUser] = useState(false);
  const [libraries, setLibraries] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = JSON.parse(atob(token.split(".")[1])).role.toLowerCase();
      if (userRole !== "user") setHasPermissions(true);
      setBookData(initialBookData);
    }
    console.log("Esto lo he puesto para los 20mins");
  }, [token]);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await fetchData(
          "/public/libraries/list",
          "GET",
          null,
          token
        );
        setLibraries(data);

        if (!library) {
          setLibrary(data[0]);
          localStorage.setItem("libraryName", data[0]);
        }
      } catch (error) {
        toast.error("Failed to fetch libraries.");
      }
    };

    fetchLibraries();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userPayload = JSON.parse(atob(token.split(".")[1]));
      const birthDate = new Date(userPayload.birthDate); 
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setIsAdultUser(age >= 18);
    }
  }, []);

  useEffect(() => {
    fetchBooksData(page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitle(searchTermTitle);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTermTitle]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAuthor(searchTermAuthor);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTermAuthor]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedGenre(searchTermGenre);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTermGenre]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStartDate(startDateFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [startDateFilter]);

  useEffect(() => {
    setBooks([]);
    setPage(0);
    fetchBooksData(
      0,
      debouncedStartDate ? debouncedStartDate.getFullYear() : null
    );
  }, [
    debouncedTitle,
    debouncedAuthor,
    debouncedGenre,
    debouncedStartDate,
    bookData.isAdult,
    library,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLibrary = localStorage.getItem("libraryName");
      setLibrary((prev) => (prev !== currentLibrary ? currentLibrary : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (library) {
      setBooks([]);
      setPage(0);
      fetchBooksData(0);
    }
  }, [library]);

  useEffect(() => {
    localStorage.setItem("searchTermTitle", searchTermTitle);
  }, [searchTermTitle]);

  useEffect(() => {
    localStorage.setItem("searchTermAuthor", searchTermAuthor);
  }, [searchTermAuthor]);

  useEffect(() => {
    localStorage.setItem("searchTermGenre", searchTermGenre);
  }, [searchTermGenre]);

  useEffect(() => {
    localStorage.setItem("startDateFilter", startDateFilter || "");
  }, [startDateFilter]);

  useEffect(() => {
    localStorage.setItem("isAdultFilter", bookData.isAdult);
  }, [bookData.isAdult]);

  const fetchBooksData = useCallback(
    async (page, year = null) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const params = {
          page,
          size: "10",
          ...(debouncedTitle && { bookName: debouncedTitle }),
          ...(debouncedAuthor && { authorName: debouncedAuthor }),
          ...(year !== null && { date: year }),
          ...(debouncedGenre && { genreName: debouncedGenre }),
          ...(isAdultUser
            ? bookData.isAdult !== "both" && { isAdult: bookData.isAdult }
            : { isAdult: "false" }),
        };

        const queryString = new URLSearchParams(params).toString();
        const libraryName =
          localStorage.getItem("libraryName") || libraries[0]?.name;
        const url = `/public/books/filter/${libraryName}?${queryString}`;
        const data = await fetchData(url, "GET", null, token);

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
        setIsFetching(false);
      }
    },
    [
      isFetching,
      debouncedTitle,
      debouncedAuthor,
      bookData.isAdult,
      debouncedGenre,
      library,
    ]
  );

  const fetchDataWithErrorHandling = async (url, setState, errorMessage) => {
    try {
      const data = await fetchData(url);
      setState(data);
    } catch (error) {
      toast.error(error.message || errorMessage);
      setState([]);
    }
  };

  const fetchAuthors = (searchString) =>
    fetchDataWithErrorHandling(
      `/public/authors/search?search=${searchString}`,
      setAuthors,
      "Failed to fetch authors."
    );

  const fetchGenres = (searchString) =>
    fetchDataWithErrorHandling(
      `/public/genres/search?search=${searchString}`,
      setGenres,
      "Failed to fetch genres."
    );

  const openModal = () => {
    fetchAuthors("");
    fetchGenres("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBookData(initialBookData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(
        "/librarian/books",
        "POST",
        bookData,
        token
      );
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

  const navigateToBookDetails = (title) => {
    navigate(`/viewBook/${encodeURIComponent(title)}`);
  };

  return (
    <main
      className="fade-in d-flex flex-column justify-content-center align-items-center"
      style={{ overflow: "hidden" }}
    >
      {hasPermissions && (
        <section className="d-flex justify-content-start w-100 ms-3">
          <button
            className="btn btn-primary my-2"
            onClick={openModal}
            aria-label="Create a new book"
          >
            Create New Book
          </button>
        </section>
      )}

      <CreateBookModal
        showModal={showModal}
        closeModal={closeModal}
        handleSave={handleSave}
        bookData={bookData}
        setBookData={setBookData}
        authors={authors}
        genres={genres}
        libraries={libraries}
        aria-label="Create book modal"
      />

      <header className="container text-center mt-4">
        <Filters
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          searchTermTitle={searchTermTitle}
          setSearchTermTitle={setSearchTermTitle}
          searchTermAuthor={searchTermAuthor}
          setSearchTermAuthor={setSearchTermAuthor}
          searchTermGenre={searchTermGenre}
          setSearchTermGenre={setSearchTermGenre}
          resetFilters={() => {
            setStartDateFilter("");
            setSearchTermTitle("");
            setSearchTermAuthor("");
            setSearchTermGenre("");
            fetchBooksData(0);
          }}
          fetchBooksData={fetchBooksData}
          bookData={bookData}
          setBookData={setBookData}
          isAdultUser={isAdultUser}
          setIsAdultUser={setIsAdultUser}
          aria-label="Book filters"
        />

        <CardSizeSelector cardSize={cardSize} setCardSize={setCardSize} />
      </header>

      <section className="container mt-5">
        <InfiniteScroll
          dataLength={books.length}
          next={() => setPage((prev) => prev + 1)}
          hasMore={!isFetching && books.length % 10 === 0 && books.length > 0}
          loader={<Loading />}
          endMessage={
            <p className="text-center mt-4 text-muted">
              There aren't more books
            </p>
          }
          style={{ overflow: "hidden" }}
        >
          <div className="row gy-4">
            {Array.isArray(books) &&
              books.map((book) => (
                <BookCard
                key={`${book.id}-${book.title}`} // Composite key using id and title
                book={book}
                cardSize={cardSize}
                defaultBook={defaultBook}
                onClick={() => navigateToBookDetails(book.title)}
              />
              ))}
          </div>
        </InfiniteScroll>
      </section>
    </main>
  );
}
