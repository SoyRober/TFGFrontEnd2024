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
      aria-labelledby="createCopyModalTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="createCopyModalTitle">Add New Copy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBarcode">
            <Form.Label htmlFor="barcodeInput">Barcode</Form.Label>
            <Form.Control
              id="barcodeInput"
              type="text"
              placeholder="Enter barcode"
              value={newCopy.barcode}
              onChange={(e) =>
                setNewCopy({ ...newCopy, barcode: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formLibrary">
            <Form.Label htmlFor="librarySelect">Library</Form.Label>
            <Form.Control
              id="librarySelect"
              as="select"
              value={newCopy.libraryName}
              onChange={(e) =>
                setNewCopy({ ...newCopy, libraryName: e.target.value })
              }
            >
              <option value="">Select a library</option>
              {libraries.map((libraryName, index) => (
                <option key={index} value={libraryName}>
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
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleAddCopy}
        >
          Add Copy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCopyModal;
