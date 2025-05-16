import { Modal, Button } from "react-bootstrap";

const ReserveForUserModal = ({ show, onClose, onConfirm, selectedUser }) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="reserveBookTitle"
      role="dialog"
      aria-modal="true"
    >
      <Modal.Header closeButton>
        <Modal.Title id="reserveBookTitle">
          Reserve Book for User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Would you like to reserve this book for {selectedUser}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Reserve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReserveForUserModal;
