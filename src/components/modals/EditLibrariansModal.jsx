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
	// Convert strings to react-select's { value, label } format
	const options = allLibrarians.map((name) => ({ value: name, label: name }));
	const selectedOptions = selectedLibrarians.map((name) => ({
		value: name,
		label: name,
	}));

	const handleChange = (selected) => {
		// selected can be null or an array
		onSelect(selected ? selected.map((option) => option.value) : []);
	};

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Manage Librarians</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Select librarians from the list below:</p>
				<Select
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
				<Button variant="primary" onClick={onSave}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditLibrariansModal;
