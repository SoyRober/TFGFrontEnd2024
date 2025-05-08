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
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Manage Librarians</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					{allLibrarians.map((librarian) => (
						<Form.Check
							key={librarian}
							type="checkbox"
							label={librarian}
							checked={selectedLibrarians.includes(librarian)}
							onChange={() => handleCheckboxChange(librarian)}
						/>
					))}
				</Form>
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
