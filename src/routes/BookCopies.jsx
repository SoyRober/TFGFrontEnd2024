import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

export default function BookCopies() {
	const { title } = useParams();
	const [copies, setCopies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [libraries, setLibraries] = useState([]);
	const [newCopy, setNewCopy] = useState({ barcode: "", libraryName: "" });
	const [showChangeLibraryModal, setShowChangeLibraryModal] = useState(false);
	const [selectedCopyId, setSelectedCopyId] = useState(null);
	const [selectedLibrary, setSelectedLibrary] = useState("");

	useEffect(() => {
		fetchBookCopies();
	}, [title]);

	const fetchBookCopies = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(
				`/bookCopy/getCopies?title=${encodeURIComponent(title)}`,
				"GET"
			);
			setCopies(data);
		} catch (err) {
			setError(err.message || "Failed to fetch book copies");
			toast.error(err.message || "Failed to fetch book copies");
		} finally {
			setLoading(false);
		}
	};

	const fetchLibraries = async () => {
		try {
			const data = await fetchData("/libraries/list", "GET");
			setLibraries(data);
			console.log("🚀 ~ fetchLibraries ~ data:", data);
		} catch (err) {
			toast.error("Failed to fetch libraries");
		}
	};

	const handleAddCopy = async () => {
		if (!newCopy.barcode || !newCopy.libraryName) {
			toast.error("Both Barcode and Library are required");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				"/bookCopy/addCopy",
				"POST",
				{
					bookTitle: title,
					barcode: newCopy.barcode,
					libraryName: newCopy.libraryName,
				},
				token
			);
			toast.success("Copy added successfully");
			setShowModal(false);
			setNewCopy({ barcode: "", libraryName: "" });
			await fetchBookCopies();
		} catch (err) {
			toast.error(err.message || "Failed to add copy");
		}
	};

	const handleChangeLibrary = async (copyId) => {
		setSelectedCopyId(copyId);
		setSelectedLibrary("");
		setShowChangeLibraryModal(true);
	};

	const submitChangeLibrary = async () => {
		if (!selectedLibrary) {
			toast.error("Please select a library");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/bookCopy/changeLibrary`,
				"POST",
				{ copyId: selectedCopyId, libraryName: selectedLibrary },
				token
			);
			toast.success("Library changed successfully");
			setShowChangeLibraryModal(false);
			await fetchBookCopies();
		} catch (err) {
			toast.error(err.message || "Failed to change library");
		}
	};

	const handleDeleteCopy = async (copyId) => {
		if (!window.confirm("Are you sure you want to delete this copy?")) {
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/bookCopy/deleteCopy?copyId=${copyId}`,
				"DELETE",
				null,
				token
			);
			toast.success("Copy deleted successfully");
			await fetchBookCopies();
		} catch (err) {
			toast.error(err.message || "Failed to delete copy");
		}
	};

	useEffect(() => {
		fetchLibraries();
	}, []);

	if (loading) {
		return <div className="container mt-5">Loading book copies...</div>;
	}

	if (error) {
		return <div className="container mt-5 alert alert-danger">{error}</div>;
	}

	return (
		<div className="container mt-5">
			<h1>Copies of {title}</h1>
			{copies.length === 0 ? (
				<p>No copies available for this book.</p>
			) : (
				<ul className="list-group">
					{copies.map((copy) => (
						<li
							key={copy.id}
							className="list-group-item d-flex align-items-center flex-wrap"
							style={{ padding: "10px" }}
						>
							<div className="col-md-2">
								<strong>Barcode:</strong> {copy.barcode}
							</div>
							<div className="col-md-2">
								<strong>Available:</strong>{" "}
								{copy.available ? (
									<span className="text-success">Yes</span>
								) : (
									<span className="text-danger">No</span>
								)}
							</div>
							<div className="col-md-3">
								<strong>Library:</strong> {copy.libraryName}
							</div>
							<div className="col-md-3">
								{copy.reserveUser !== "none" ? (
									<span className="text-warning">
										Reserved by: {copy.reserveUser}
									</span>
								) : copy.loanUser !== "none" ? (
									<span className="text-info">Loaned to: {copy.loanUser}</span>
								) : (
									<span>No current reservation or loan</span>
								)}
							</div>
							<div className="col-md-2 text-end d-flex justify-content-between">
								<Button
									variant="warning"
									size="sm"
									className="me-1"
									onClick={() => handleChangeLibrary(copy.id)}
								>
									Change Library
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleDeleteCopy(copy.id)}
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
				onClick={() => setShowModal(true)}
			>
				Add New Copy
			</Button>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Add New Copy</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formBarcode">
							<Form.Label>Barcode</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter barcode"
								value={newCopy.barcode}
								onChange={(e) =>
									setNewCopy({ ...newCopy, barcode: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group controlId="formLibrary">
							<Form.Label>Library</Form.Label>
							<Form.Control
								as="select"
								value={newCopy.libraryName}
								onChange={(e) =>
									setNewCopy({ ...newCopy, libraryName: e.target.value })
								}
							>
								<option value="">Select a library</option>
								{libraries.map((libraryName, index) => (
									<option key={index} value={libraryName}>
										{libraryName}
									</option>
								))}
							</Form.Control>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={handleAddCopy}>
						Add Copy
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showChangeLibraryModal}
				onHide={() => setShowChangeLibraryModal(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Change Library</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formChangeLibrary">
							<Form.Label>Select New Library</Form.Label>
							<Form.Control
								as="select"
								value={selectedLibrary}
								onChange={(e) => setSelectedLibrary(e.target.value)}
							>
								<option value="">Select a library</option>
								{libraries.map((libraryName, index) => (
									<option key={index} value={libraryName}>
										{libraryName}
									</option>
								))}
							</Form.Control>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowChangeLibraryModal(false)}
					>
						Close
					</Button>
					<Button variant="primary" onClick={submitChangeLibrary}>
						Change Library
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
