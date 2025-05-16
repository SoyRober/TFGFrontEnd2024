import { Button, Modal } from 'react-bootstrap';

export default function BookReservationModal({ show, onClose, onConfirm, onCancel }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="bookReservationModalTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="bookReservationModalTitle">Book Reservation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        This book isn't currently available. Would you like to make a reservation?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => { onCancel(); onClose(); }}
        >
          No
        </Button>
        <Button
          variant="primary"
          onClick={() => { onConfirm(); onClose(); }}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
