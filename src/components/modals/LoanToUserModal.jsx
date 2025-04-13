import { Modal, Button, Form } from "react-bootstrap";

const LoanToUserModal = ({
	show,
	onClose,
	onConfirm,
	selectedUser,
	setSelectedUser,
	daysLoaned,
	setDaysLoaned,
}) => {
	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Loan Book to User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formUsername">
						<Form.Label>User email</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter email"
							value={selectedUser}
							onChange={(e) => setSelectedUser(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="formDaysLoaned">
						<Form.Label>Days Loaned</Form.Label>
						<Form.Control
							type="number"
							placeholder="Enter number of days"
							value={daysLoaned}
							onChange={(e) => setDaysLoaned(Number(e.target.value))}
							min="1"
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="primary" onClick={onConfirm}>
					Confirm Loan
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LoanToUserModal;
