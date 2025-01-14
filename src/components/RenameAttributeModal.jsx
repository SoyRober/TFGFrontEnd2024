import React, { useState, useEffect } from "react";
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
    console.log("🚀 ~ handleSubmit ~ attribute:", attribute);
    console.log("🚀 ~ handleSubmit ~ attribute.id:", attribute.id);

    handleRename(attribute.id, newName);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rename this attribute</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAttributeName">
            <Form.Label>New Attribute Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new attribute name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameAttributeModal;
