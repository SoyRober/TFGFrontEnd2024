import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddAttributeWithDateModal = ({ show, handleClose, handleAdd }) => {
  const [newName, setNewName] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(newName, new Date(selectedDate));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="addAttributeWithDateModalTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="addAttributeWithDateModalTitle">Add New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAttributeName" className="mb-3">
            <Form.Label htmlFor="attributeNameInput">Name</Form.Label>
            <Form.Control
              id="attributeNameInput"
              type="text"
              placeholder="Enter name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAttributeDate" className="mb-3">
            <Form.Label htmlFor="attributeDateInput">Birth Date</Form.Label>
            <Form.Control
              id="attributeDateInput"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAttributeWithDateModal;
