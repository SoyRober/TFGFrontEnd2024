import { Modal, Button } from "react-bootstrap";

const ReactivationInfoModal = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      aria-label="Reactivation Info Modal"
      className=""
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title aria-label="Account Reactivation Title">
          Account reactivation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white" aria-label="Reactivation Info Message">
        If you deactivated your account and want it back, contact our support
        and send your username and email.
        <br />
        <a
          href="mailto:bibliosupport@gmail.com?subject=Reactivation Request"
          className="text-info"
          aria-label="Support Email Link"
        >
          bibliosupport@gmail.com
        </a>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button
          variant="secondary"
          onClick={handleClose}
          aria-label="Close Reactivation Info Modal Button"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReactivationInfoModal;
