import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import SelectableList from "../navbar/SelectableList.jsx";
import { compressImage } from "../../utils/compressImage.js";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

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
      const imageResizedFile = await compressImage(file, 0.7, 300, 300, 100);
      const base64Image = await fileToBase64(imageResizedFile);
      setBookData((prev) => ({ ...prev, image: base64Image }));
    } else {
      setBookData((prev) => ({ ...prev, image: "" }));
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
      aria-labelledby="createBookModalTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="createBookModalTitle">Create New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          {" "}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookTitle">
                <Form.Label htmlFor="bookTitleInput">Book Title:</Form.Label>
                <Form.Control
                  type="text"
                  id="bookTitleInput"
                  name="title"
                  value={bookData.title}
                  onChange={handleInputChange}
                  placeholder="Book Title"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookAuthors">
                <Form.Label>Book Authors:</Form.Label>
                <SelectableList
                  label="Author"
                  items={authors}
                  selectedItems={bookData.authors}
                  handleAddItem={(item) => handleAddItem("authors", item)}
                  handleRemoveItem={(item) => handleRemoveItem("authors", item)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookGenres">
                <Form.Label>Book Genres:</Form.Label>
                <SelectableList
                  label="Genre"
                  items={genres}
                  selectedItems={bookData.genres}
                  handleAddItem={(item) => handleAddItem("genres", item)}
                  handleRemoveItem={(item) => handleRemoveItem("genres", item)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookLibraries">
                <Form.Label>Book Libraries:</Form.Label>
                <SelectableList
                  label="Library"
                  items={libraries}
                  selectedItems={bookData.libraries}
                  handleAddItem={(item) => handleAddItem("libraries", item)}
                  handleRemoveItem={(item) =>
                    handleRemoveItem("libraries", item)
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="bookLocation">
                <Form.Label htmlFor="bookLocationInput">
                  Book Location:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="bookLocationInput"
                  name="location"
                  value={bookData.location}
                  onChange={handleInputChange}
                  placeholder="Corridor A, Shelf 1."
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookSynopsis">
                <Form.Label htmlFor="bookSynopsisInput">
                  Book Synopsis:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="bookSynopsisInput"
                  name="synopsis"
                  value={bookData.synopsis}
                  onChange={handleInputChange}
                  placeholder="In this book, you will learn..."
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookPublicationDate">
                <Form.Label htmlFor="bookPublicationDateInput">
                  Book Publication Date:
                </Form.Label>
                <Form.Control
                  type="date"
                  id="bookPublicationDateInput"
                  name="publicationDate"
                  value={bookData.publicationDate}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookIsAdult">
                <Form.Check
                  type="checkbox"
                  id="bookIsAdultInput"
                  name="isAdult"
                  label="Is Adult"
                  checked={bookData.isAdult}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookImage">
                <Form.Label htmlFor="bookImageInput">
                  Book Image: (Optional)
                </Form.Label>
                <Form.Control
                  type="file"
                  id="bookImageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {bookData.image && (
                  <img
                    src={`data:image/jpeg;base64,${bookData.image}`}
                    alt="Preview"
                    style={{ marginTop: 10, maxWidth: "100%", maxHeight: 200 }}
                  />
                )}
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
