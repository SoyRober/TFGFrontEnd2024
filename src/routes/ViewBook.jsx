import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/main.css';

export default function ViewBook() {
  const { title } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [reviewData, setReviewData] = useState({ score: '', rating: '' });

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
        setBook(data);
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
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchBookData();
    fetchReviews();
  }, [title]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prevData => ({
      ...prevData,
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
        body: JSON.stringify({
          title: title,
          score: reviewData.score,
          rating: reviewData.rating
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }

      // Fetch updated reviews after submission
      const updatedReviews = await fetch(`http://localhost:8080/getReviewsByBookTitle?title=${encodeURIComponent(title)}`);
      const reviewsData = await updatedReviews.json();
      setReviews(reviewsData);

      // Clear review form
      setReviewData({ score: '', rating: '' });

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
        <div className="col-md-6 mb-3">
          {imageSrc ? (
            <img src={imageSrc} alt={book.title} className="img-fluid" />
          ) : (
            <div>No image available</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Title:</span> {book.title}</p>
          <p><span className="label">Authors:</span> {book.authors ? book.authors.join(', ') : 'N/A'}</p>
          <p><span className="label">Genres:</span> {book.genres ? book.genres.join(', ') : 'N/A'}</p>
          <p><span className="label">Quantity:</span> {book.quantity}</p>
          <p><span className="label">Location:</span> {book.location}</p>
          <p><span className="label">Synopsis:</span> {book.synopsis}</p>
          <p><span className="label">Publication Date:</span> {book.publicationDate}</p>
          <p><span className="label">Adult:</span> {book.adult ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <h2 className="mt-5">Reviews</h2>
      <div className="list-group mb-3">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="list-group-item">
              <p><strong>User:</strong> {review.userName}</p>
              <p><strong>Score:</strong> {review.score}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>

      {isLoggedIn && (
        <form onSubmit={handleReviewSubmit} className="mb-5">
          <div className="form-group">
            <label>Score:</label>
            <select
              className="form-control"
              name="score"
              value={reviewData.score}
              onChange={handleReviewChange}
              required
            >
              <option value="">Select score</option>
              {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <textarea
              className="form-control"
              id="rating"
              name="rating"
              value={reviewData.rating}
              onChange={handleReviewChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
        </form>
      )}
    </div>
  );
}
