import { Modal, Button, Form } from "react-bootstrap";

const ChangeLibraryModal = ({
  showChangeLibraryModal,
  setShowChangeLibraryModal,
  selectedLibrary,
  setSelectedLibrary,
  selectedBarcode,
  setSelectedBarcode,
  libraries,
  submitChangeLibrary,
}) => {
  return (
    <Modal
      show={showChangeLibraryModal}
      onHide={() => setShowChangeLibraryModal(false)}
      aria-labelledby="changeAttributesTitle"
      role="dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title id="changeAttributesTitle">Change Attributes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formChangeBarcode" className="mb-3">
            <Form.Label htmlFor="formChangeBarcodeInput">Change Barcode</Form.Label>
            <Form.Control
              id="formChangeBarcodeInput"
              type="text"
              placeholder="Enter new barcode"
              value={selectedBarcode}
              onChange={(e) => setSelectedBarcode(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formChangeLibrary">
            <Form.Label htmlFor="formChangeLibrarySelect">Select New Library</Form.Label>
            <Form.Control
              id="formChangeLibrarySelect"
              as="select"
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
            >
              <option value="">Select a library</option>
              {libraries.map((libraryName, index) => (
                <option key={index} value={libraryName}>
                  {libraryName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowChangeLibraryModal(false)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={submitChangeLibrary}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeLibraryModal;
