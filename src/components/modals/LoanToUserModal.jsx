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
		<Modal show={show} onHide={onClose} aria-label="Loan Book to User Modal">
			<Modal.Header closeButton>
				<Modal.Title aria-label="Loan Book to User Title">
					Loan Book to User
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form aria-label="Loan Book to User Form">
					<Form.Group controlId="formUsername">
						<Form.Label aria-label="User Email Label">User email</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter email"
							value={selectedUser}
							onChange={(e) => setSelectedUser(e.target.value)}
							aria-label="Enter user email"
						/>
					</Form.Group>
					<Form.Group controlId="formDaysLoaned">
						<Form.Label aria-label="Days Loaned Label">Days Loaned</Form.Label>
						<Form.Control
							type="number"
							placeholder="Enter number of days"
							value={daysLoaned}
							onChange={(e) => setDaysLoaned(Number(e.target.value))}
							min="1"
							aria-label="Enter number of days loaned"
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={onClose}
					aria-label="Cancel Loan Button"
				>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={onConfirm}
					aria-label="Confirm Loan Button"
				>
					Confirm Loan
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default LoanToUserModal;
