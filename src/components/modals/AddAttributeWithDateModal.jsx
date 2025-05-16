import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddAttributeWithDateModal = ({ show, handleClose, handleAdd }) => {
  const [newName, setNewName] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // formato yyyy-mm-dd
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(newName, new Date(selectedDate));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-label="Add Attribute with Date Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Add New Attribute with Date Title">Add New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} aria-label="Add Attribute with Date Form">
          <Form.Group controlId="formAttributeName" className="mb-3">
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
          <Form.Group controlId="formAttributeDate" className="mb-3">
            <Form.Label aria-label="Attribute Date Label">Birth Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-control"
              required
              aria-label="Select birth date"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            aria-label="Add Attribute with Date Button"
          >
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAttributeWithDateModal;
