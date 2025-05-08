import { Button, Modal } from 'react-bootstrap';

export default function BookReservationModal ({ show, onClose, onConfirm, onCancel }) {
  return (
      <Modal show={show} onHide={onClose} aria-label="Book Reservation Modal">
        <Modal.Header closeButton>
          <Modal.Title aria-label="Book Reservation Title">Book Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body aria-label="Book Reservation Message">
          This book isn't currently available. Would you like to make a reservation?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => { onCancel(); onClose(); }}
            aria-label="Cancel Reservation Button"
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => { onConfirm(); onClose(); }}
            aria-label="Confirm Reservation Button"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
  );
};
