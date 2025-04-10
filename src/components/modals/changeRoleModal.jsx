import { Modal, Form, Button } from 'react-bootstrap';

const ChangeRoleModal = ({
  showModal,
  setShowModal,
  selectedRole,
  setSelectedRole,
  handleRoleChange
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Change User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRoleSelect">
            <Form.Label>Select Role</Form.Label>
            <Form.Control
              as="select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)} // Actualiza el rol seleccionado
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
