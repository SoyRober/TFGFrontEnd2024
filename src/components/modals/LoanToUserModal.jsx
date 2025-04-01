import { Modal, Button, Form } from "react-bootstrap";

const LoanToUserModal = ({ show, onClose, onConfirm, selectedUser, setSelectedUser }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Loan Book to User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>User email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm Loan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanToUserModal;