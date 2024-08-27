import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import CreateBookModal from "../components/CreateBookModal";
import Notification from "../components/Notification";
import { jwtDecode } from 'jwt-decode';
import { fetchData } from '../utils/fetch.js';
import Loading from "../components/Loading.jsx";

export default function Homepage() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthors, setBookAuthors] = useState([]);
  const [bookGenres, setBookGenres] = useState([]);
  const [bookQuantity, setBookQuantity] = useState('');
  const [bookLocation, setBookLocation] = useState('');
  const [bookSynopsis, setBookSynopsis] = useState('');
  const [bookPublicationDate, setBookPublicationDate] = useState('');
  const [bookIsAdult, setBookIsAdult] = useState(false);
  const [bookImageBase64, setBookImageBase64] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchStringAuthors, setSearchStringAuthors] = useState('');
  const [searchStringGenres, setSearchStringGenres] = useState('');
  const [cardSize, setCardSize] = useState(300);
  const [cardSizeSave, setCardSizeSave] = useState(() => {
    return localStorage.getItem('cardSize') ? parseInt(localStorage.getItem('cardSize')) : 450;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [atBottom, setAtBottom] = useState(false);
  const [page, setPage] = useState(0);
  const [extraBottomSpace, setExtraBottomSpace] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationKey, setNotificationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
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
    setCardSize(cardSizeSave);
  }, [cardSizeSave]);

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

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [atBottom, page]);


  useEffect(() => {
    localStorage.setItem('cardSize', cardSize);
  }, [cardSize]);

  const fetchBooksData = async (page) => {
    try {
      const data = await fetchData(`/getAllBooks?page=${page}&size=10`);

      setBooks(prevBooks => {
        const newBooks = data.books.filter(
          newBook => !prevBooks.some(book => book.title === newBook.title)
        );
        return [...prevBooks, ...newBooks];
      });

      setFilteredBooks(prevBooks => {
        const newBooks = data.books.filter(
          newBook => !prevBooks.some(book => book.title === newBook.title)
        );
        return [...prevBooks, ...newBooks];
      });

      setPage(page);
      setExtraBottomSpace(extraBottomSpace + cardSize / 7);
    } catch (error) {
      setNotificationMessage(error.message);
      setNotificationKey(prevKey => prevKey + 1);
      console.error(error.message);
    } finally {
      setAtBottom(false);
      setIsLoading(false);
    }
  };


  const fetchAuthors = async (token, searchString) => {
    try {
      const data = await fetchData('/searchAuthors', 'POST', searchString, token, 'text/plain');
      setAuthors(data);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      setAuthors([]);
    }
  };

  const fetchGenres = async (token, searchString) => {
    try {
      const data = await fetchData('/searchGenres', 'POST', searchString, token, 'text/plain');
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
    const selectedAuthors = Array.from(e.target.selectedOptions, option => option.value);
    setBookAuthors(selectedAuthors);
  };

  const handleGenreChange = (e) => {
    const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
    setBookGenres(selectedGenres);
  };

  const handleAuthorsSearchChange = (e) => {
    setSearchStringAuthors(e.target.value);
    const token = localStorage.getItem('token');
    fetchAuthors(token, e.target.value);
  };

  const handleGenresSearchChange = (e) => {
    setSearchStringGenres(e.target.value);
    const token = localStorage.getItem('token');
    fetchGenres(token, e.target.value);
  };

  const openModal = () => {
    const token = localStorage.getItem('token');
    fetchAuthors(token, searchStringAuthors);
    fetchGenres(token, searchStringGenres);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    clearForm();
  };

  const clearForm = () => {
    setBookTitle('');
    setBookAuthors([]);
    setBookGenres([]);
    setBookQuantity('');
    setBookLocation('');
    setBookSynopsis('');
    setBookPublicationDate('');
    setBookIsAdult(false);
    setBookImageBase64('');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const bookData = {
      title: bookTitle,
      authors: bookAuthors,
      genres: bookGenres,
      quantity: bookQuantity,
      location: bookLocation,
      synopsis: bookSynopsis,
      publicationDate: bookPublicationDate,
      isAdult: bookIsAdult,
      imageBase64: bookImageBase64
    };

    try {
      const response = await fetchData("/saveBook", "POST", bookData, token);

      if (!response.success) {
        const errorMessage = response.message || 'Failed to save book.';
        setNotificationMessage(errorMessage);
        setNotificationKey(notificationKey + 1);
        return;
      }

      setNotificationMessage(response.message || 'Book saved successfully.');
      setNotificationKey(notificationKey + 1);
      fetchBooksData(page);
    } catch (error) {
      console.error("Failed to save book:", error);
      setNotificationMessage(error.message || 'An unknown error occurred.');
      setNotificationKey(notificationKey + 1);
    }
  };

  const calculateColumns = () => {
    const columns = Math.min(5, Math.max(1, Math.floor(12 / (cardSize / 100))));
    return `col-${Math.floor(12 / columns)}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterBooks(e.target.value);
  };

  const filterBooks = (term) => {
    if (!term) {
      setFilteredBooks(books);
    } else {
      const lowerCaseTerm = term.toLowerCase();
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(lowerCaseTerm) ||
        book.authors.some(author => author.toLowerCase().includes(lowerCaseTerm)) ||
        book.genres.some(genre => genre.toLowerCase().includes(lowerCaseTerm))
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <div className="fade-in d-flex flex-column justify-content-center align-items-center" style={{ paddingBottom: `${extraBottomSpace}px` }}>

      {notificationMessage && (
        <div className="mb-4 text-center d-flex justify-content-left">
          <Notification key={notificationKey} message={notificationMessage} />
        </div>
      )}

      <CreateBookModal
        showModal={showModal}
        closeModal={closeModal}
        handleSave={handleSave}
        bookTitle={bookTitle}
        setBookTitle={setBookTitle}
        bookAuthors={bookAuthors}
        setBookAuthors={setBookAuthors}
        authors={authors}
        searchStringAuthors={searchStringAuthors}
        handleAuthorsSearchChange={handleAuthorsSearchChange}
        handleAuthorChange={handleAuthorChange}
        bookGenres={bookGenres}
        setBookGenres={setBookGenres}
        genres={genres}
        searchStringGenres={searchStringGenres}
        handleGenresSearchChange={handleGenresSearchChange}
        handleGenreChange={handleGenreChange}
        bookQuantity={bookQuantity}
        setBookQuantity={setBookQuantity}
        bookLocation={bookLocation}
        setBookLocation={setBookLocation}
        bookSynopsis={bookSynopsis}
        setBookSynopsis={setBookSynopsis}
        bookPublicationDate={bookPublicationDate}
        setBookPublicationDate={setBookPublicationDate}
        bookIsAdult={bookIsAdult}
        setBookIsAdult={setBookIsAdult}
        setBookImageBase64={setBookImageBase64}
        notificationMessage={notificationMessage}
        notificationKey={notificationKey}
      />

      <div className="container text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '50vh' }}>

        <h1 className="mb-4">Book List</h1>


        {hasPermissions && (
          <button className="btn btn-primary mb-3" onClick={openModal}>
            Create New Book
          </button>
        )}

        <div className="row w-100 justify-content-center mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search books..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="row w-100 justify-content-center">
          <div className="col-md-4">
            <div className="btn-group w-100" role="group" aria-label="Card size selector">
              <button
                type="button"
                className={`btn btn-outline-primary ${cardSize === 250 ? 'active' : ''}`}
                onClick={() => setCardSize(250)}
              >
                <i className="fas fa-square" style={{ fontSize: '8px' }}></i>
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${cardSize === 350 ? 'active' : ''}`}
                onClick={() => setCardSize(350)}
              >
                <i className="fas fa-square" style={{ fontSize: '16px' }}></i>
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${cardSize === 600 ? 'active' : ''}`}
                onClick={() => setCardSize(600)}
              >
                <i className="fas fa-square" style={{ fontSize: '32px' }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          {!isLoading ? (
            filteredBooks.map((book) => (
              <div key={book.title} className={calculateColumns()}>
                <div
                  className="card mb-4 customized-card"
                  onClick={() => navigateToBookDetails(book.title)}
                  style={{ height: `${cardSize}px`, minHeight: `${cardSize}px`, minWidth: `${cardSize}px` }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '60%', objectFit: 'cover' }}
                  >
                    <img
                      src={book.image ? `data:image/jpeg;base64,${book.image}` : 'placeholder-image-url'}
                      className="img-fluid"
                      alt={book.title}
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <hr className="my-0" style={{ borderTop: '1px solid black', width: '80%' }} />
                  </div>

                  <div className="card-body">
                    <h5 className="card-title text-center my-4">{book.title}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
}
