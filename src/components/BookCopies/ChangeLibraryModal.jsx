import { Modal, Button, Form } from 'react-bootstrap';

const ChangeLibraryModal = ({
    showChangeLibraryModal,
    setShowChangeLibraryModal,
    selectedLibrary,
    setSelectedLibrary,
    libraries,
    submitChangeLibrary,
}) => {
    return (
        <Modal
            show={showChangeLibraryModal}
            onHide={() => setShowChangeLibraryModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Change Library</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
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
                    Change Library
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeLibraryModal;