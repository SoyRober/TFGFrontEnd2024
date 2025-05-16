import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditAttributeModal({
  show,
  handleClose,
  handleUpdateAttribute,
  attribute,
}) {
  const [newName, setNewName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (attribute) {
      setNewName(attribute.name || "");
      setSelectedDate(
        attribute.birthDate
          ? new Date(attribute.birthDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [attribute]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleUpdateAttribute(attribute.id, newName, new Date(selectedDate));
  };

  return (
    <Modal show={show} onHide={handleClose} centered aria-labelledby="editAttributeTitle">
      <Modal.Header closeButton>
        <Modal.Title id="editAttributeTitle">Edit Attribute</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <Form.Group controlId="formAttributeName" className="mb-3">
            <Form.Label htmlFor="nameInput">Name</Form.Label>
            <Form.Control
              type="text"
              id="nameInput"
              placeholder="Enter new attribute name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              aria-required="true"
            />
          </Form.Group>
          <Form.Group controlId="formAttributeDate" className="mb-3">
            <Form.Label htmlFor="dateInput">Birth Date</Form.Label>
            <Form.Control
              type="date"
              id="dateInput"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              aria-required="true"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={!newName.trim() || !selectedDate}
          >
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
