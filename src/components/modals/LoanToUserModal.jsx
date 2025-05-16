import { Modal, Button, Form } from "react-bootstrap";

const LoanToUserModal = ({
  show,
  onClose,
  onConfirm,
  selectedUser,
  setSelectedUser,
  daysLoaned,
  setDaysLoaned,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="loanBookToUserTitle"
      aria-modal="true"
      role="dialog"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="loanBookToUserTitle">Loan Book to User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form aria-label="Loan Book to User Form">
          <Form.Group controlId="formUsername">
            <Form.Label>User email</Form.Label>
            <Form.Control
              type="email"
              id="formUsername"
              placeholder="Enter email"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              aria-describedby="emailHelp"
            />
            <small id="emailHelp" className="form-text text-muted">
              Enter a valid user email
            </small>
          </Form.Group>
          <Form.Group controlId="formDaysLoaned" className="mt-3">
            <Form.Label>Days Loaned</Form.Label>
            <Form.Control
              type="number"
              id="formDaysLoaned"
              placeholder="Enter number of days"
              value={daysLoaned}
              onChange={(e) => setDaysLoaned(Number(e.target.value))}
              min="1"
              required
              aria-describedby="daysHelp"
            />
            <small id="daysHelp" className="form-text text-muted">
              Minimum 1 day
            </small>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={!selectedUser || !daysLoaned}>
          Confirm Loan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanToUserModal;
