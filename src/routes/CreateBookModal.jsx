import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

export default function CreateBookModal({
  showModal,
  closeModal,
  handleSave,
  bookTitle,
  setBookTitle,
  bookAuthors,
  setBookAuthors,
  authors,
  searchStringAuthors,
  handleAuthorsSearchChange,
  handleAuthorChange,
  bookGenres,
  setBookGenres,
  genres,
  searchStringGenres,
  handleGenresSearchChange,
  handleGenreChange,
  bookQuantity,
  setBookQuantity,
  bookLocation,
  setBookLocation,
  bookSynopsis,
  setBookSynopsis,
  bookPublicationDate,
  setBookPublicationDate,
  bookIsAdult,
  setBookIsAdult,
  setBookImageBase64 // Nuevo setter para la imagen en base64
}) {

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
          <Form.Group className="mb-3" controlId="bookImage"> {/* Nuevo campo para la imagen */}
            <Form.Label>Book Image:</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
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
  );
}
