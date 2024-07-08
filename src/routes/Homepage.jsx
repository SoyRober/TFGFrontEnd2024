import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [books, setBooks] = useState([]);

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

  const fetchBooksData = async () => {
    // Replace with your API call to fetch books
    const response = await fetch("http://localhost:8080/api/books");
    const data = await response.json();
    setBooks(data);
    $('#booksTable').DataTable();
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
        <h1>Book list</h1>
        <table id="booksTable" className="display">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>
                  <Link to={`/viewBook/${book.id}`}>{book.title}</Link>
                </td>
                <td>
                  <ul className="list-unstyled">
                    {book.bookAuthors.map(author => (
                      <li key={author.id}>{author.name}</li>
                    ))}
                  </ul>
                </td>
                <td>{book.categories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
