import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import SelectableList from "./SelectableList";
import { compressImage } from "../utils/compressImage.js";

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
  setSearchStringAuthors,
  bookGenres,
  setBookGenres,
  genres,
  searchStringGenres,
  setSearchStringGenres,
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
  setBookImage,
}) {

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageResized = await compressImage(file, 200, 200);
      setBookImage(imageResized);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddAuthor = (e) => {
    const selectedAuthor = e.target.value;
    if (selectedAuthor && !bookAuthors.includes(selectedAuthor)) {
      setBookAuthors([...bookAuthors, selectedAuthor]);
      setSearchStringAuthors("");
    }
  };

  const handleAddGenre = (e) => {
    const selectedGenre = e.target.value;
    if (selectedGenre && !bookGenres.includes(selectedGenre)) {
      setBookGenres([...bookGenres, selectedGenre]);
      setSearchStringGenres("");
    }
  };

  const onSave = () => {
    handleSave();
    closeModal();
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Create New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookTitle">
                <Form.Label>Book Title:</Form.Label>
                <Form.Control
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="BookTitle"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookAuthors">
                <Form.Label>Book Authors:</Form.Label>
                <SelectableList
                  label="Author"
                  items={authors}
                  selectedItems={bookAuthors}
                  newItem={searchStringAuthors}
                  setNewItem={setSearchStringAuthors}
                  handleAddItem={handleAddAuthor}
                  handleRemoveItem={(author) =>
                    setBookAuthors(bookAuthors.filter((a) => a !== author))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookGenres">
                <Form.Label>Book Genres:</Form.Label>
                <SelectableList
                  label="Genre"
                  items={genres}
                  selectedItems={bookGenres}
                  newItem={searchStringGenres}
                  setNewItem={setSearchStringGenres}
                  handleAddItem={handleAddGenre}
                  handleRemoveItem={(genre) =>
                    setBookGenres(bookGenres.filter((g) => g !== genre))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookQuantity">
                <Form.Label>Book Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  value={bookQuantity}
                  onChange={(e) => setBookQuantity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <div>
              <hr />
            </div>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookLocation">
                <Form.Label>Book Location:</Form.Label>
                <Form.Control
                  type="text"
                  value={bookLocation}
                  onChange={(e) => setBookLocation(e.target.value)}
                  placeholder="Corridor A, Shelf 1."
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookSynopsis">
                <Form.Label>Book Synopsis:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={bookSynopsis}
                  onChange={(e) => setBookSynopsis(e.target.value)}
                  placeholder="In this book, you will learn..."
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookPublicationDate">
                <Form.Label>Book Publication Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={bookPublicationDate}
                  onChange={(e) => setBookPublicationDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookIsAdult">
                <Form.Label>Is Adult:</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={bookIsAdult}
                  onChange={(e) => setBookIsAdult(e.target.checked)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookImage">
                <Form.Label>Book Image: (Optional)</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
