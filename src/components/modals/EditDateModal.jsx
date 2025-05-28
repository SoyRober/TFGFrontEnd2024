import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditDateModal({
	show,
	onClose,
	attribute,
	value,
	onChange,
	onSave,
	errorMessage,
}) {
	return (
		<Modal
			show={show}
			onHide={onClose}
			aria-labelledby="editDateModalTitle"
			aria-modal="true"
			role="dialog"
		>
			<Modal.Header closeButton>
				<Modal.Title id="editDateModalTitle">Edit {attribute}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group controlId="editDateInput">
					<Form.Label>New {attribute}</Form.Label>
					<Form.Control
						type="date"
						value={value}
						onChange={onChange}
						placeholder={`Select new ${attribute}`}
						aria-required="true"
					/>
				</Form.Group>
				{errorMessage && (
					<p
						style={{ color: "red", marginTop: "10px" }}
						role="alert"
						aria-live="assertive"
					>
						{errorMessage}
					</p>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={onSave}
					disabled={!`${value ?? ""}`.trim()}
				>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
