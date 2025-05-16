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
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="renameAttributeTitle"
      role="dialog"
      aria-modal="true"
    >
      <Modal.Header closeButton>
        <Modal.Title id="renameAttributeTitle">
          Rename this attribute
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAttributeName">
            <Form.Label htmlFor="newNameInput">Name</Form.Label>
            <Form.Control
              id="newNameInput"
              type="text"
              placeholder="Enter new attribute name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameAttributeModal;
