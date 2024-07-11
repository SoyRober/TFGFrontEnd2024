import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Authors: {book.authors.join(', ')}</p>
      <p>Genres: {book.genres.join(', ')}</p>
      <p>Quantity: {book.quantity}</p>
      <p>Location: {book.location}</p>
      <p>Adult: {book.isAdult ? "Yes" : "No"}</p>
      <p>Synopsis: {book.synopsis}</p>
      <p>Publication Date: {book.publicationDate}</p>
    </div>
  );
}
