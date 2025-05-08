import { Modal, Button } from "react-bootstrap";

const ReserveForUserModal = ({ show, onClose, onConfirm, selectedUser }) => {
  return (
    <Modal show={show} onHide={onClose} aria-label="Reserve Book for User Modal">
      <Modal.Header closeButton>
        <Modal.Title aria-label="Reserve Book for User Title">
          Reserve Book for User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body aria-label="Reserve Book for User Message">
        Would you like to reserve this book for {selectedUser}?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          aria-label="Cancel Reserve Button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          aria-label="Confirm Reserve Button"
        >
          Reserve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReserveForUserModal;