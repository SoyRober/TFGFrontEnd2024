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
      aria-labelledby="changeUserRoleTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="changeUserRoleTitle">Change User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRoleSelect">
            <Form.Label htmlFor="roleSelect">Select Role</Form.Label>
            <Form.Control
              as="select"
              id="roleSelect"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="LIBRARIAN">LIBRARIAN</option>
              <option value="USER">USER</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => handleRoleChange(selectedRole)}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeRoleModal;
