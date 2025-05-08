import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditDateModal({
  show,
  onClose,
  attribute,
  value,
  onChange,
  onSave,
  errorMessage
}) {
  return (
    <Modal show={show} onHide={onClose} aria-label="Edit Date Modal">
      <Modal.Header closeButton>
        <Modal.Title aria-label={`Edit ${attribute} Title`}>Edit {attribute}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group aria-label={`Edit ${attribute} Form Group`}>
          <Form.Label aria-label={`New ${attribute} Label`}>New {attribute}</Form.Label>
          <Form.Control
            type="date"
            value={value}
            onChange={onChange}
            placeholder="Select new date"
            aria-label={`Select new ${attribute}`}
          />
        </Form.Group>
        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }} aria-label="Error Message">
            {errorMessage}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          aria-label="Cancel Edit Date Button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          aria-label="Save Edited Date Button"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
