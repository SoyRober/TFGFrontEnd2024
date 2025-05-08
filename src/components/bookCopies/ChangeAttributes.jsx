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
      aria-label="Change Attributes Modal"
    >
      <Modal.Header closeButton>
        <Modal.Title aria-label="Change Attributes Title">
          Change Attributes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Input para cambiar el Barcode */}
          <Form.Group controlId="formChangeBarcode" className="mb-3">
            <Form.Label aria-label="Change Barcode Label">Change Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new barcode"
              value={selectedBarcode}
              onChange={(e) => setSelectedBarcode(e.target.value)}
              aria-label="Enter new barcode"
            />
          </Form.Group>

          {/* Dropdown para cambiar la Library */}
          <Form.Group controlId="formChangeLibrary">
            <Form.Label aria-label="Select New Library Label">Select New Library</Form.Label>
            <Form.Control
              as="select"
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              aria-label="Select a new library"
            >
              <option value="" aria-label="Select a library option">Select a library</option>
              {libraries.map((libraryName, index) => (
                <option key={index} value={libraryName} aria-label={`Library ${libraryName}`}>
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
          aria-label="Close Modal Button"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={submitChangeLibrary}
          aria-label="Save Changes Button"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeLibraryModal;
