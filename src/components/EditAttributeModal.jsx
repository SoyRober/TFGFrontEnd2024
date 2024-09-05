import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditAttributeModal({
  show,
  onClose,
  attribute,
  value,
  onChange,
  placeholder,
  onSave,
  errorMessage
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit {attribute}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>New {attribute}</Form.Label>
          <Form.Control
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </Form.Group>
        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
