import { Modal, Button } from "react-bootstrap";

const ReactivationInfoModal = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      aria-labelledby="reactivationInfoTitle"
      role="dialog"
      aria-modal="true"
      className="bg-dark text-white"
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title id="reactivationInfoTitle">
          Account reactivation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        If you deactivated your account and want it back, contact our support
        and send your username and email.
        <br />
        <a
          href="mailto:bibliosupport@gmail.com?subject=Reactivation Request"
          className="text-info"
        >
          bibliosupport@gmail.com
        </a>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReactivationInfoModal;
