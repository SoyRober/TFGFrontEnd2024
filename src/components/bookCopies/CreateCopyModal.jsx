import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const CreateCopyModal = ({
  showModal,
  setShowModal,
  newCopy,
  setNewCopy,
  libraries,
  handleAddCopy,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      aria-label="Create Copy Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Add New Copy Title">Add New Copy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBarcode">
            <Form.Label aria-label="Barcode Label">Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter barcode"
              value={newCopy.barcode}
              onChange={(e) =>
                setNewCopy({ ...newCopy, barcode: e.target.value })
              }
              aria-label="Enter barcode"
            />
          </Form.Group>
          <Form.Group controlId="formLibrary">
            <Form.Label aria-label="Library Label">Library</Form.Label>
            <Form.Control
              as="select"
              value={newCopy.libraryName}
              onChange={(e) =>
                setNewCopy({ ...newCopy, libraryName: e.target.value })
              }
              aria-label="Select a library"
            >
              <option value="" aria-label="Select a library option">
                Select a library
              </option>
              {libraries.map((libraryName, index) => (
                <option
                  key={index}
                  value={libraryName}
                  aria-label={`Library ${libraryName}`}
                >
                  {libraryName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          aria-label="Close Modal Button"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleAddCopy}
          aria-label="Add Copy Button"
        >
          Add Copy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCopyModal;
