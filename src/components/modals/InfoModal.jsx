import { Modal, Button } from "react-bootstrap";

const InfoModal = ({ show, handleClose, content }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      aria-labelledby="reactivationInfoTitle"
      role="dialog"
      aria-modal="true"
    >
      <Modal.Header closeButton>
        <Modal.Title id="reactivationInfoTitle">Account reactivation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
