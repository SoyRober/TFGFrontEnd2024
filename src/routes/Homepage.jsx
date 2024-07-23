import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import CreateBookModal from "./CreateBookModal";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    fetchBooksData();

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      const userRole = "ADMIN";
      if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
        setHasPermissions(true);
      }

      fetchAuthors(token, '');
      fetchGenres(token, '');
    }
  }, []);

  const fetchBooksData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllBooks");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    }
  };

  const fetchAuthors = async (token, searchString) => {
    try {
      const url = "http://localhost:8080/searchAuthors";
      const bodyContent = searchString || '';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`
        },
        body: bodyContent
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      setAuthors([]);
    }
  };

  const fetchGenres = async (token, searchString) => {
    try {
      const url = "http://localhost:8080/searchGenres";
      const bodyContent = searchString || '';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`
        },
        body: bodyContent
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
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
    setBookImageBase64(''); // Limpiar el estado de la imagen base64
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
      imageBase64: bookImageBase64 // Enviar la imagen en base64
    };

    console.log("Saving book data:", bookData);

    try {
      const response = await fetch("http://localhost:8080/saveBook", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      console.log(result.message);
      closeModal();
      fetchBooksData();
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  return (
    <>
      {hasPermissions && (
        <div>
          <button className="btn btn-primary" onClick={openModal}>
            Create New Book
          </button>
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
      />

      <div className="container mt-5">
        <h1>Book List</h1>
        <div className="row">
          {books.map(book => (
            <div key={book.title} className="col-md-3 mb-4">
              <div 
                className="card"
                onClick={() => navigateToBookDetails(book.title)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={book.image ? `data:image/jpeg;base64,${book.image}` : 'placeholder-image-url'}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
