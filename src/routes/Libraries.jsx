import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import { Button, Modal, Form } from "react-bootstrap";
import EditAttributeModal from "../components/modals/EditAttributeModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";

export default function Libraries() {
	const [libraries, setLibraries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddLibraryModal, setShowAddLibraryModal] = useState(false);
	const [newLibrary, setNewLibrary] = useState({ name: "", address: "" });
	const [showEditModal, setShowEditModal] = useState(false);
	const [editAttribute, setEditAttribute] = useState("");
	const [editValue, setEditValue] = useState("");
	const [selectedLibraryId, setSelectedLibraryId] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [libraryToDelete, setLibraryToDelete] = useState(null);

	useEffect(() => {
		fetchLibraries();
	}, []);

	const fetchLibraries = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData("/libraries/detailedList", "GET");
			setLibraries(data);
		} catch (err) {
			setError(err.message || "Failed to fetch libraries");
			toast.error(err.message || "Failed to fetch libraries");
		} finally {
			setLoading(false);
		}
	};

	const handleAddLibrary = async () => {
		if (!newLibrary.name || !newLibrary.address) {
			toast.error("Both Name and Address are required");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				"/libraries",
				"POST",
				{ name: newLibrary.name, address: newLibrary.address },
				token
			);
			toast.success("Library created successfully");
			setShowAddLibraryModal(false);
			setNewLibrary({ name: "", address: "" });
			await fetchLibraries();
		} catch (err) {
			toast.error(err.message || "Failed to create library");
		}
	};

	const handleEditAttribute = (libraryId, attribute, currentValue) => {
		setSelectedLibraryId(libraryId);
		setEditAttribute(attribute);
		setEditValue(currentValue);
		setErrorMessage("");
		setShowEditModal(true);
	};

	const submitEditAttribute = async () => {
		if (!editValue) {
			setErrorMessage(`Please enter a new ${editAttribute}`);
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/libraries/${selectedLibraryId}`,
				"PUT",
				{ [editAttribute]: editValue },
				token
			);
			toast.success(
				`${
					editAttribute.charAt(0).toUpperCase() + editAttribute.slice(1)
				} updated successfully`
			);
			setShowEditModal(false);
			await fetchLibraries();
		} catch (err) {
			toast.error(err.message || `Failed to update ${editAttribute}`);
		}
	};

	const handleDeleteLibrary = (libraryId) => {
		setLibraryToDelete(libraryId);
		setShowDeleteModal(true);
	};

	const confirmDeleteLibrary = async () => {
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/libraries?id=${libraryToDelete}`,
				"DELETE",
				null,
				token
			);
			toast.success("Library deleted successfully");
			setShowDeleteModal(false);
			await fetchLibraries();
		} catch (err) {
			toast.error(err.message || "Failed to delete library");
		}
	};

	if (loading) {
		return <div className="container mt-5">Loading libraries...</div>;
	}

	if (error) {
		return <div className="container mt-5 alert alert-danger">{error}</div>;
	}

	return (
		<div className="container mt-5">
			<h1>Libraries</h1>
			{libraries.length === 0 ? (
				<p>No libraries available.</p>
			) : (
				<ul className="list-group">
					{libraries.map((library) => (
						<li
							key={library.id}
							className="list-group-item d-flex align-items-center flex-wrap"
							style={{ padding: "10px" }}
						>
							<div className="col-md-4">
								<strong>Name:</strong> {library.name}
							</div>
							<div className="col-md-4">
								<strong>Address:</strong> {library.address}
							</div>
							<div className="col-md-4 text-end d-flex justify-content-between">
								<Button
									variant="info"
									size="sm"
									className="me-1"
									onClick={() =>
										handleEditAttribute(library.id, "name", library.name)
									}
								>
									Change Name
								</Button>
								<Button
									variant="warning"
									size="sm"
									className="me-1"
									onClick={() =>
										handleEditAttribute(library.id, "address", library.address)
									}
								>
									Change Address
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleDeleteLibrary(library.id)}
								>
									Delete
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}

			<Button
				variant="primary"
				className="mt-3"
				style={{ position: "absolute", bottom: "20px", left: "20px" }}
				onClick={() => setShowAddLibraryModal(true)}
			>
				Add New Library
			</Button>

			<Modal
				show={showAddLibraryModal}
				onHide={() => setShowAddLibraryModal(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Add New Library</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formLibraryName">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter library name"
								value={newLibrary.name}
								onChange={(e) =>
									setNewLibrary({ ...newLibrary, name: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group controlId="formLibraryAddress" className="mt-3">
							<Form.Label>Address</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter library address"
								value={newLibrary.address}
								onChange={(e) =>
									setNewLibrary({ ...newLibrary, address: e.target.value })
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowAddLibraryModal(false)}
					>
						Close
					</Button>
					<Button variant="primary" onClick={handleAddLibrary}>
						Add Library
					</Button>
				</Modal.Footer>
			</Modal>

			<EditAttributeModal
				show={showEditModal}
				onClose={() => setShowEditModal(false)}
				attribute={editAttribute}
				value={editValue}
				onChange={(e) => setEditValue(e.target.value)}
				placeholder={`Enter new ${editAttribute}`}
				onSave={submitEditAttribute}
				errorMessage={errorMessage}
			/>

			<DeleteConfirmationModal
				show={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onDelete={confirmDeleteLibrary}
				message="Are you sure you want to delete this library? This action cannot be undone."
			/>
		</div>
	);
}
