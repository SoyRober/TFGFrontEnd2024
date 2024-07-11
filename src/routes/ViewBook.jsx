import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/main.css';

export default function ViewBook() {
  const { title } = useParams();
  const [book, setBook] = useState(null);

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

    fetchBookData();
  }, [title]);

  if (!book) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">{book.title}</h1>
      <div className="row">
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
    </div>
  );
}
