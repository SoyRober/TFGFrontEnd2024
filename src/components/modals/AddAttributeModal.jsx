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
      aria-labelledby="addAttributeModalTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="addAttributeModalTitle">Add New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAttributeName">
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
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
          >
            Add
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAttributeModal;
