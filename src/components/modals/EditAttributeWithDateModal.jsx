import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAttributeModal = ({
  show,
  handleClose,
  handleUpdateAttribute,
  attribute,
}) => {
  const [newName, setNewName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (attribute) {
      setNewName(attribute.name);
    }
  }, [attribute]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleUpdateAttribute(attribute.id, newName, selectedDate);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-label="Edit Attribute with Date Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Edit Attribute with Date Title">
          Edit this attribute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleEditSubmit}
          aria-label="Edit Attribute with Date Form"
        >
          <Form.Group controlId="formAttributeName" className="mb-3">
            <Form.Label aria-label="Attribute Name Label">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new attribute name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              aria-label="Enter new attribute name"
            />
          </Form.Group>
          <Form.Group controlId="formAttributeDate" className="mb-3">
            <Form.Label aria-label="Attribute Date Label">Birth Date</Form.Label>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="form-control"
                required
                aria-label="Select birth date"
              />
            </div>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            aria-label="Save Edited Attribute with Date Button"
          >
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditAttributeModal;
