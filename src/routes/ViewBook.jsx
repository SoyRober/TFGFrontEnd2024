import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/main.css';

export default function ViewBook() {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ score: 0, rating: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageSrc, setImageSrc] = useState('');  // Define el estado para la imagen
  const [editingAttribute, setEditingAttribute] = useState(null);  // Define el estado para el atributo en edición
  const [editValue, setEditValue] = useState('');  // Define el estado para el nuevo valor del atributo

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getBookByTitle?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Book data:", data);
        setBook(data.books);

        // Establecer la imagen en Base64 si está disponible
        setImageSrc(data.image ? `data:image/jpeg;base64,${data.image}` : '');
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getReviewsByBookTitle?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchBookData();
    fetchReviews();
  }, [title]);

  const handleStarClick = (score) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      score
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview, 
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/addReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newReview, book: { title } })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNewReview({ score: 0, rating: '' });
      const updatedReviews = await response.json();
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleEditClick = (attribute) => {
    setEditingAttribute(attribute);
    setEditValue(book[attribute]);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }
  
    const payload = {
      title: title,
      attribute: editingAttribute,
      value: editValue
    };
  
    try {
      const response = await fetch('http://localhost:8080/updateBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedBook = await response.json();
      setBook(updatedBook);
      setEditingAttribute(null);
      location.reload();
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };
  

  const handleCloseModal = () => {
    setEditingAttribute(null);
  };

  if (!book) {
    return <div className="container mt-5">Loading...</div>;
  }

  const renderEditModal = () => {
    if (!editingAttribute) return null;

    let inputField;

    switch (editingAttribute) {
      case 'quantity':
        inputField = (
          <input
            type="number"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
        break;
      case 'isAdult':
        inputField = (
          <select
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
        break;
      case 'publicationDate':
        inputField = (
          <input
            type="date"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
        break;
      default:
        inputField = (
          <input
            type="text"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
    }

    return (
      <div className="modal show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit {editingAttribute}</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="editValue">New Value</label>
                  {inputField}
                </div>
                <button type="submit" className="btn btn-primary mt-3">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">{book.title}</h1>
      <div className="row">
        <div className="col-md-6 mb-3">
          {imageSrc && <img src={imageSrc} alt={book.title} className="img-fluid" />}
          {isLoggedIn && <button onClick={() => handleEditClick('image')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Title:</span> {book.title}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('title')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Authors:</span> {book.authors?.join(', ')}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('authors')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Genres:</span> {book.genres?.join(', ')}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('genres')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Quantity:</span> {book.quantity}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('quantity')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Location:</span> {book.location}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('location')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Synopsis:</span> {book.synopsis}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('synopsis')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Publication Date:</span> {book.publicationDate}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('publicationDate')} className="btn btn-primary">Edit</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Adult:</span> {book.isAdult ? 'Yes' : 'No'}</p>
          {isLoggedIn && <button onClick={() => handleEditClick('isAdult')} className="btn btn-primary">Edit</button>}
        </div>
      </div>

      <h2 className="mt-5">Reviews</h2>
      <div className="list-group mb-3">
        {reviews.map((review, index) => (
          <div key={index} className="list-group-item">
            <p><strong>Score:</strong> {review.score}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
          </div>
        ))}
      </div>

      {isLoggedIn && (
        <form onSubmit={handleReviewSubmit} className="mb-5">
          <div className="form-group">
            <label>Score:</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn btn-${newReview.score >= star ? 'warning' : 'secondary'} star-btn`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <textarea className="form-control" id="rating" name="rating" value={newReview.rating} onChange={handleReviewChange} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
        </form>
      )}

      {renderEditModal()}
    </div>
  );
}
