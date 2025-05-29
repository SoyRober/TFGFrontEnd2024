import { Modal, Button, Form } from "react-bootstrap";

export default function EditAttributeModal({
	show,
	onClose,
	attribute,
	value,
	onChange,
	placeholder,
	onSave,
	errorMessage,
}) {
	const handleSubmit = (e) => {
		e.preventDefault();
		onSave();
	};

	const inputId = `edit-${
		attribute?.toLowerCase().replace(/\s+/g, "-") || "input"
	}`;

	return (
		<Modal
			show={show}
			onHide={onClose}
			centered
			aria-labelledby="editAttributeModalTitle"
			role="dialog"
		>
			<Modal.Header closeButton>
				<Modal.Title id="editAttributeModalTitle">Edit {attribute}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form
					onSubmit={handleSubmit}
					aria-describedby={errorMessage ? "editAttributeError" : undefined}
				>
					<Form.Group className="mb-3" controlId={inputId}>
						<Form.Label htmlFor={inputId}>New {attribute}</Form.Label>
						<Form.Control
							type="text"
							id={inputId}
							value={value ?? ""}
							onChange={onChange}
							placeholder={placeholder}
							aria-required="true"
							aria-invalid={!!errorMessage}
							aria-describedby={errorMessage ? "editAttributeError" : undefined}
						/>
					</Form.Group>

					{errorMessage && (
						<div
							id="editAttributeError"
							style={{ color: "#B00020", marginTop: "10px" }}
							role="alert"
						>
							{errorMessage}
						</div>
					)}
				</Form>
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={onClose}
					aria-label="Cancel editing attribute"
				>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={onSave}
					disabled={!(value ?? "").trim()}
					type="submit"
					aria-label={`Save new ${attribute}`}
				>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
