import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '../styles/main.css';
import $ from "jquery";
import { Modal, Button, Form } from 'react-bootstrap';

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
  const [showModal, setShowModal] = useState(false);
  const [searchStringAuthors, setSearchStringAuthors] = useState('');
  const [searchStringGenres, setSearchStringGenres] = useState('');
  const [navigateToViewBook, setNavigateToViewBook] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
        setHasPermissions(true);
      }

      fetchBooksData(token);
      fetchAuthors(token, '');
      fetchGenres(token, '');
    }
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      initDataTable();
    }
  }, [books]);

  useEffect(() => {
    if (navigateToViewBook) {
      // Aquí podrías realizar alguna lógica adicional si es necesaria
      navigateToBookDetails();
      // Limpia el estado después de la navegación
      setNavigateToViewBook(false);
    }
  }, [navigateToViewBook]);

  const fetchBooksData = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/getAllBooks", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
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

  const initDataTable = () => {
    if ($.fn.dataTable.isDataTable('#booksTable')) {
      $('#booksTable').DataTable().destroy();
    }

    $('#booksTable').DataTable({
      data: books,
      columns: [
        { data: 'title', title: 'Title' },
        { data: 'authors', title: 'Authors', render: authors => authors.join(', ') }
      ]
    });

    // Asigna el click a la fila de la tabla
    $('#booksTable tbody').on('click', 'tr', function () {
      const data = $('#booksTable').DataTable().row(this).data();
      if (data) {
        setNavigateToViewBook(true); // Cambia el estado para navegar a la página ViewBook
        setBookTitle(data.title); // Guarda el título del libro seleccionado si es necesario
      }
    });
  };

  const navigateToBookDetails = () => {
    const selectedBook = books.find(book => book.title === bookTitle);
    if (selectedBook) {
      navigate(`/viewBook/${encodeURIComponent(selectedBook.title)}`);
    }
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
      isAdult: bookIsAdult
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
      fetchBooksData(token);
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

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="bookTitle">
              <Form.Label>Book Title:</Form.Label>
              <Form.Control type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookAuthors">
              <Form.Label>Book Authors:</Form.Label>
              <Form.Control type="text" placeholder="Search..." value={searchStringAuthors} onChange={handleAuthorsSearchChange} />
              <Form.Control as="select" multiple value={bookAuthors} onChange={handleAuthorChange}>
                {authors.map((author, index) => (
                  <option key={index} value={author}>{author}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookGenres">
              <Form.Label>Book Genres:</Form.Label>
              <Form.Control type="text" placeholder="Search..." value={searchStringGenres} onChange={handleGenresSearchChange} />
              <Form.Control as="select" multiple value={bookGenres} onChange={handleGenreChange}>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>{genre}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookQuantity">
              <Form.Label>Book Quantity:</Form.Label>
              <Form.Control type="number" value={bookQuantity} onChange={(e) => setBookQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookLocation">
              <Form.Label>Book Location:</Form.Label>
              <Form.Control type="text" value={bookLocation} onChange={(e) => setBookLocation(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookSynopsis">
              <Form.Label>Book Synopsis:</Form.Label>
              <Form.Control as="textarea" value={bookSynopsis} onChange={(e) => setBookSynopsis(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookPublicationDate">
              <Form.Label>Book Publication Date:</Form.Label>
              <Form.Control type="date" value={bookPublicationDate} onChange={(e) => setBookPublicationDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bookIsAdult">
              <Form.Label>Is Adult:</Form.Label>
              <Form.Check type="checkbox" checked={bookIsAdult} onChange={(e) => setBookIsAdult(e.target.checked)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container mt-5">
        <h1>Book List</h1>
        <table id="booksTable" className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.authors.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
