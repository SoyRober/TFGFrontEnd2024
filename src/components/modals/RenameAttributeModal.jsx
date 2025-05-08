import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RenameAttributeModal = ({
  show,
  handleClose,
  handleRename,
  attribute,
}) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (attribute) {
      setNewName(attribute.name);
    }
  }, [attribute]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRename(attribute.id, newName);
  };

  return (
    <Modal show={show} onHide={handleClose} aria-label="Rename Attribute Modal">
      <Modal.Header closeButton>
        <Modal.Title aria-label="Rename Attribute Title">
          Rename this attribute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} aria-label="Rename Attribute Form">
          <Form.Group controlId="formAttributeName">
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
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            aria-label="Save Renamed Attribute Button"
          >
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameAttributeModal;
