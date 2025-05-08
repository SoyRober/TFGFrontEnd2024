import { Modal, Form, Button } from 'react-bootstrap';

const ChangeRoleModal = ({
  showModal,
  setShowModal,
  selectedRole,
  setSelectedRole,
  handleRoleChange
}) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      aria-label="Change Role Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Change User Role Title">Change User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form aria-label="Change Role Form">
          <Form.Group controlId="formRoleSelect">
            <Form.Label aria-label="Select Role Label">Select Role</Form.Label>
            <Form.Control
              as="select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Select a role"
            >
              <option value="ADMIN" aria-label="Admin Role">ADMIN</option>
              <option value="LIBRARIAN" aria-label="Librarian Role">LIBRARIAN</option>
              <option value="USER" aria-label="User Role">USER</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          aria-label="Cancel Button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => handleRoleChange(selectedRole)}
          aria-label="Submit Role Change Button"
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeRoleModal;
