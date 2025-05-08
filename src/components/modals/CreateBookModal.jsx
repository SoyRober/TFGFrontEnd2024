import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import SelectableList from "../navbar/SelectableList.jsx";
import { compressImage } from "../../utils/compressImage.js";

export default function CreateBookModal({
  showModal,
  closeModal,
  handleSave,
  bookData,
  setBookData,
  authors,
  genres,
  libraries,
}) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageResized = await compressImage(file, 200, 200);
      setBookData((prev) => ({ ...prev, image: imageResized }));
    } else {
      setBookData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleAddItem = (key, item) => {
    if (item && !bookData[key].includes(item)) {
      setBookData((prev) => ({
        ...prev,
        [key]: [...prev[key], item],
      }));
    }
  };

  const handleRemoveItem = (key, item) => {
    setBookData((prev) => ({
      ...prev,
      [key]: prev[key].filter((i) => i !== item),
    }));
  };

  const onSave = () => {
    handleSave();
  };

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      size="xl"
      aria-label="Create Book Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Create New Book Title">
          Create New Book
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form aria-label="Create Book Form">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookTitle">
                <Form.Label aria-label="Book Title Label">
                  Book Title:
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={bookData.title}
                  onChange={handleInputChange}
                  placeholder="Book Title"
                  aria-label="Enter book title"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookAuthors">
                <Form.Label aria-label="Book Authors Label">
                  Book Authors:
                </Form.Label>
                <SelectableList
                  label="Author"
                  items={authors}
                  selectedItems={bookData.authors}
                  handleAddItem={(item) => handleAddItem("authors", item)}
                  handleRemoveItem={(item) => handleRemoveItem("authors", item)}
                  aria-label="Select authors"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookGenres">
                <Form.Label aria-label="Book Genres Label">
                  Book Genres:
                </Form.Label>
                <SelectableList
                  label="Genre"
                  items={genres}
                  selectedItems={bookData.genres}
                  handleAddItem={(item) => handleAddItem("genres", item)}
                  handleRemoveItem={(item) => handleRemoveItem("genres", item)}
                  aria-label="Select genres"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookLibraries">
                <Form.Label aria-label="Book Libraries Label">
                  Book Libraries:
                </Form.Label>
                <SelectableList
                  label="Library"
                  items={libraries}
                  selectedItems={bookData.libraries}
                  handleAddItem={(item) => handleAddItem("libraries", item)}
                  handleRemoveItem={(item) =>
                    handleRemoveItem("libraries", item)
                  }
                  aria-label="Select libraries"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookLocation">
                <Form.Label aria-label="Book Location Label">
                  Book Location:
                </Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={bookData.location}
                  onChange={handleInputChange}
                  placeholder="Corridor A, Shelf 1."
                  aria-label="Enter book location"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookSynopsis">
                <Form.Label aria-label="Book Synopsis Label">
                  Book Synopsis:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="synopsis"
                  value={bookData.synopsis}
                  onChange={handleInputChange}
                  placeholder="In this book, you will learn..."
                  aria-label="Enter book synopsis"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookPublicationDate">
                <Form.Label aria-label="Book Publication Date Label">
                  Book Publication Date:
                </Form.Label>
                <Form.Control
                  type="date"
                  name="publicationDate"
                  value={bookData.publicationDate}
                  onChange={handleInputChange}
                  aria-label="Select publication date"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookIsAdult">
                <Form.Label aria-label="Is Adult Label">Is Adult:</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="isAdult"
                  checked={bookData.isAdult}
                  onChange={handleInputChange}
                  aria-label="Check if book is for adults"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bookImage">
                <Form.Label aria-label="Book Image Label">
                  Book Image: (Optional)
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  aria-label="Upload book image"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={closeModal}
          aria-label="Cancel Button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          aria-label="Save Book Button"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
