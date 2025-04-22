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
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Attributes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Input para cambiar el Barcode */}
          <Form.Group controlId="formChangeBarcode" className="mb-3">
            <Form.Label>Change Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new barcode"
              value={selectedBarcode}
              onChange={(e) => setSelectedBarcode(e.target.value)}
            />
          </Form.Group>

          {/* Dropdown para cambiar la Library */}
          <Form.Group controlId="formChangeLibrary">
            <Form.Label>Select New Library</Form.Label>
            <Form.Control
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
        <Button variant="primary" onClick={submitChangeLibrary}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeLibraryModal;
