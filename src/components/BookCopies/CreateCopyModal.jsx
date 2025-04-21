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
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Copy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBarcode">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter barcode"
              value={newCopy.barcode}
              onChange={(e) =>
                setNewCopy({ ...newCopy, barcode: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formLibrary">
            <Form.Label>Library</Form.Label>
            <Form.Control
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
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddCopy}>
          Add Copy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCopyModal;
