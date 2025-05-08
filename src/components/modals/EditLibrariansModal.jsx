import { Modal, Button, Form } from "react-bootstrap";

const EditLibrariansModal = ({
	show,
	onClose,
	allLibrarians,
	selectedLibrarians,
	onSelect,
	onSave,
}) => {
	const handleCheckboxChange = (librarian) => {
		if (selectedLibrarians.includes(librarian)) {
			onSelect(selectedLibrarians.filter((l) => l !== librarian));
		} else {
			onSelect([...selectedLibrarians, librarian]);
		}
	};

	return (
		<Modal show={show} onHide={onClose} aria-label="Edit Librarians Modal">
			<Modal.Header closeButton>
				<Modal.Title aria-label="Manage Librarians Title">
					Manage Librarians
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form aria-label="Edit Librarians Form">
					{allLibrarians.map((librarian) => (
						<Form.Check
							key={librarian}
							type="checkbox"
							label={librarian}
							checked={selectedLibrarians.includes(librarian)}
							onChange={() => handleCheckboxChange(librarian)}
							aria-label={`Select librarian ${librarian}`}
						/>
					))}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={onClose}
					aria-label="Close Edit Librarians Modal Button"
				>
					Close
				</Button>
				<Button
					variant="primary"
					onClick={onSave}
					aria-label="Save Librarians Changes Button"
				>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditLibrariansModal;
