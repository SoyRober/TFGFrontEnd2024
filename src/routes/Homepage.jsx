import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import $ from 'jquery';

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Set isLibrarian and isAdmin based on your logic, for example:
      // setIsLibrarian(true/false);
      // setIsAdmin(true/false);
    }

    // Fetch books data from your API
    fetchBooksData();
  }, []);

  useEffect(() => {
    // Initialize DataTables after component mount
    if (books.length > 0) {
      initDataTable();
    }
  }, [books]);

  const fetchBooksData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllBooks");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    }
  };

  const initDataTable = () => {
    // Verificar si DataTables ya está inicializado en #booksTable
    if ($.fn.dataTable.isDataTable('#booksTable')) {
      // Si está inicializado, destruir la instancia existente antes de reinitializar
      $('#booksTable').DataTable().destroy();
    }

    // Inicializar DataTables con los nuevos datos
    $('#booksTable').DataTable({
      data: books,
      columns: [
        { data: 'title', title: 'Title' },
        { data: 'authors', title: 'Authors', render: authors => authors.join(', ') },
        // otras columnas
      ]
    });

    // Agregar evento de clic a las filas
    $('#booksTable tbody').on('click', 'tr', function () {
      const data = $('#booksTable').DataTable().row(this).data();
      if (data) {
        navigate(`/viewBook/${encodeURIComponent(data.title)}`);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLibrarian && (
        <div>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createBookModal">
            Create New Book
          </button>
        </div>
      )}

      <div className="modal fade" id="createBookModal" tabIndex="-1" aria-labelledby="createBookModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createBookModalLabel">Create New Book</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="bookTitle" className="form-label">Book Title:</label>
              <input type="text" className="form-control" id="bookTitle" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>

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
                <td>
                  <ul className="list-unstyled">
                    {book.authors.map((author, index) => (
                      <li key={index}>{author}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
