import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddAttributeModal = ({ show, handleClose, handleAdd }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(newName);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-label="Add Attribute Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Add New Attribute Title">Add New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} aria-label="Add Attribute Form">
          <Form.Group controlId="formAttributeName">
            <Form.Label aria-label="Attribute Name Label">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              aria-label="Enter attribute name"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            aria-label="Add Attribute Button"
          >
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAttributeModal;
