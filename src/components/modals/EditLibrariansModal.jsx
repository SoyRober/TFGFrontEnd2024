import { Modal, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { useState } from "react";

const EditLibrariansModal = ({
	show,
	onClose,
	allLibrarians,
	selectedLibrarians,
	onSelect,
	onSave,
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleCheckboxChange = (librarian) => {
		if (selectedLibrarians.includes(librarian)) {
			onSelect(selectedLibrarians.filter((l) => l !== librarian));
		} else {
			onSelect([...selectedLibrarians, librarian]);
		}
	};

	const handleRemoveLibrarian = (librarian) => {
		onSelect(selectedLibrarians.filter((l) => l !== librarian));
	};

	const handleAddLibrarian = () => {
		if (
			searchTerm &&
			allLibrarians.includes(searchTerm) &&
			!selectedLibrarians.includes(searchTerm)
		) {
			onSelect([...selectedLibrarians, searchTerm]);
			setSearchTerm("");
		}
	};

	const filteredLibrarians = allLibrarians.filter(
		(librarian) =>
			librarian.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!selectedLibrarians.includes(librarian)
	);

	return (
		<Modal show={show} onHide={onClose} aria-label="Edit Librarians Modal">
			<Modal.Header closeButton>
				<Modal.Title aria-label="Manage Librarians Title">
					Manage Librarians
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/*Selected Librarians */}
				<div aria-label="Selected Librarians List">
					{selectedLibrarians.map((librarian) => (
						<div key={librarian} className="d-flex align-items-center mb-2">
							<span className="me-2">{librarian}</span>
							<Button
								variant="danger"
								size="sm"
								onClick={() => handleRemoveLibrarian(librarian)}
								aria-label={`Remove librarian ${librarian}`}
							>
								X
							</Button>
						</div>
					))}
				</div>

				{/*Add librarian */}
				<InputGroup className="mb-3" aria-label="Add Librarian Input">
					<FormControl
						placeholder="Add librarian"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						list="librarian-options"
						aria-label="Librarian Search Input"
					/>
					<Button
						variant="primary"
						onClick={handleAddLibrarian}
						aria-label="Add Librarian Button"
					>
						Add
					</Button>
					<datalist id="librarian-options">
						{filteredLibrarians.map((librarian) => (
							<option key={librarian} value={librarian} />
						))}
					</datalist>
				</InputGroup>

				{/* checkboxes */}
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
