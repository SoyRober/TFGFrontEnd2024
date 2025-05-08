import { Modal, Button } from 'react-bootstrap';

export default function DeleteConfirmationModal({ show, onClose, onDelete, message }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      aria-label="Delete Confirmation Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Delete Confirmation Title">Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body aria-label="Delete Confirmation Message">
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          aria-label="Cancel Delete Button"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
          aria-label="Confirm Delete Button"
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
