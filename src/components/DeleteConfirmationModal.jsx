import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function DeleteConfirmationModal({ show, onClose, onDelete, message }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete} className='mt-3'>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
