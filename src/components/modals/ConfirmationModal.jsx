import { Modal, Button } from "react-bootstrap";

export default function ConfirmationModal({
	show,
	onClose,
	onConfirm,
	message,
}) {
	return (
		<Modal
			show={show}
			onHide={onClose}
			centered
			aria-label="Confirmation Modal"
		>
			<Modal.Header closeButton>
				<Modal.Title aria-label="Confirmation Title">Confirmate</Modal.Title>
			</Modal.Header>
			<Modal.Body aria-label="Confirmation Message">
				<p>{message}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={onClose}
					aria-label="Cancel Button"
				>
					Cancel
				</Button>
				<Button
					variant="danger"
					onClick={onConfirm}
					aria-label="Confirm Button"
				>
					Confirmate
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
