import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

const EditLibrariansModal = ({
  show,
  onClose,
  allLibrarians,
  selectedLibrarians,
  onSelect,
  onSave,
}) => {
  const options = allLibrarians.map((name) => ({ value: name, label: name }));
  const selectedOptions = selectedLibrarians.map((name) => ({
    value: name,
    label: name,
  }));

  const handleChange = (selected) => {
    onSelect(selected ? selected.map((option) => option.value) : []);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="editLibrariansModalTitle"
      aria-modal="true"
      role="dialog"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="editLibrariansModalTitle">Manage Librarians</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p id="librariansSelectDesc">Select librarians from the list below:</p>
        <label htmlFor="librariansSelect" className="visually-hidden">
          Select librarians
        </label>
        <Select
          inputId="librariansSelect"
          aria-describedby="librariansSelectDesc"
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          placeholder="Search and select librarians..."
          className="mb-3"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave} disabled={selectedOptions.length === 0}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditLibrariansModal;
