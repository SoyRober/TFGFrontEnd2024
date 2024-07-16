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

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getBookByTitle?title=${encodeURIComponent(title)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
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
    console.log("token: "+token);
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
      const updatedReviews = await fetch(`http://localhost:8080/getReviewsByBookTitle?title=${encodeURIComponent(title)}`).then(res => res.json());
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  if (!book) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">{book.title}</h1>
      <div className="row">
        {/* Existing book details */}
        <div className="col-md-6 mb-3">
          <p><span className="label">Authors:</span> {book.authors.join(', ')}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Genres:</span> {book.genres.join(', ')}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Quantity:</span> {book.quantity}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Location:</span> {book.location}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Adult:</span> {book.isAdult ? "Yes" : "No"}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Publication Date:</span> {book.publicationDate}</p>
        </div>
        <div className="col-12 mb-3">
          <p><span className="label">Synopsis:</span> {book.synopsis}</p>
        </div>
      </div>
      
      <h2 className="mt-5">Reviews</h2>
      <div className="row">
        {reviews.map((review) => (
          <div key={review.id} className="col-12 mb-3">
            <p><strong>Score:</strong> {review.score}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleReviewSubmit} className="mt-5">
        <div className="form-group">
          <label>Score</label>
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
        <div className="form-group mt-3">
          <label htmlFor="rating">Rating</label>
          <textarea className="form-control" id="rating" name="rating" value={newReview.rating} onChange={handleReviewChange} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
      </form>
    </div>
  );
}
