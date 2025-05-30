import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import ChangeLibraryModal from "../components/bookCopies/ChangeAttributes.jsx";
import CreateCopyModal from "../components/bookCopies/CreateCopyModal";
import { useNavigate } from "react-router-dom";
import { hasAuthorization } from "../utils/auth.js";

export default function BookCopies() {
	const { title } = useParams();
	const [copies, setCopies] = useState([]);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(0);
	const [managedLibraries, setManagedLibraries] = useState([]);
	const [newCopy, setNewCopy] = useState({ barcode: "", libraryName: "" });
	const [showModal, setShowModal] = useState(false);
	const [showChangeLibraryModal, setShowChangeLibraryModal] = useState(false);
	const [selectedCopyId, setSelectedCopyId] = useState(null);
	const [selectedLibrary, setSelectedLibrary] = useState("");
	const [selectedBarcode, setSelectedBarcode] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [barcodeFilter, setBarcodeFilter] = useState("");
	const [libraryFilter, setLibraryFilter] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasAuthorization(["librarian", "admin"])) navigate("/");
	}, [navigate]);

	useEffect(() => {
		setPage(0);
		setCopies([]);
		fetchBookCopies();
	}, [title, barcodeFilter, libraryFilter]);

	const fetchBookCopies = async () => {
		setError(null);
		try {
			const data = await fetchData(
				`/public/bookCopy?title=${encodeURIComponent(
					title
				)}&page=${page}&barcode=${barcodeFilter}&libraryName=${libraryFilter}`,
				"GET"
			);
			if (data.success) {
				setCopies((prev) => {
					const newCopies = data.message.filter(
						(c) => !prev.some((p) => p.id === c.id)
					);
					return [...prev, ...newCopies];
				});
			} else {
				setCopies([]);
				toast.error(data.message);
			}
		} catch (err) {
			setError(err.message || "Failed to fetch book copies");
			toast.error(err.message || "Failed to fetch book copies");
		}
	};

	const fetchMoreCopies = () => {
		setPage((p) => p + 1);
	};

	useEffect(() => {
		if (page > 0) fetchBookCopies();
	}, [page]);

	const fetchLibraries = async () => {
		try {
			const data = await fetchData("/public/libraries/list", "GET");
			setLibraries(data);
		} catch (err) {
			toast.error(err.message || "Failed to fetch libraries");
		}
	};

	const fetchManagedLibraries = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const data = await fetchData(
					"/librarian/libraries/getManagedLibrariesNames",
					"GET",
					null,
					token
				);
				setManagedLibraries(data);
			} catch (err) {
				toast.error(err.message || "Failed to fetch libraries");
			}
		} else {
			toast.error("You must be logged in to manage libraries");
		}
	};

	useEffect(() => {
		fetchLibraries();
		fetchManagedLibraries();
	}, []);

	const handleAddCopy = async () => {
		if (!newCopy.barcode || !newCopy.libraryName) {
			toast.error("Both Barcode and Library are required");
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				"/librarian/bookCopy",
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
			setPage(0);
			setCopies([]);
			fetchBookCopies();
		} catch (err) {
			toast.error(err.message || "Failed to add copy");
		}
	};

	const handleChangeLibrary = (copyId, barcode, libraryName) => {
		setSelectedCopyId(copyId);
		setSelectedBarcode(barcode);
		setSelectedLibrary(libraryName);
		setShowChangeLibraryModal(true);
	};

	const handleUpdate = async () => {
		if (!selectedLibrary && !selectedBarcode) {
			toast.error(
				"At least one attribute (Barcode or Library) must be updated"
			);
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/librarian/bookCopy`,
				"PUT",
				{
					id: selectedCopyId,
					newLibrary: selectedLibrary || "",
					newBarcode: selectedBarcode || "",
				},
				token
			);
			toast.success("Attributes changed successfully");
			setCopies((prev) =>
				prev.map((c) =>
					c.id === selectedCopyId
						? {
								...c,
								libraryName: selectedLibrary || c.libraryName,
								barcode: selectedBarcode || c.barcode,
						  }
						: c
				)
			);
			setShowChangeLibraryModal(false);
		} catch (err) {
			toast.error(err.message || "Failed to change attributes");
		}
	};

	const handleDeleteCopy = async () => {
		try {
			const token = localStorage.getItem("token");
			await fetchData(
				`/librarian/bookCopy?copyId=${selectedCopyId}`,
				"DELETE",
				null,
				token
			);
			toast.success("Copy deleted successfully");
			setShowDeleteModal(false);
			setCopies((prev) => prev.filter((c) => c.id !== selectedCopyId));
		} catch (err) {
			toast.error(err.message || "Failed to delete copy");
		}
	};

	const openDeleteModal = (copyId) => {
		setSelectedCopyId(copyId);
		setShowDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setShowDeleteModal(false);
		setSelectedCopyId(null);
	};

	if (error) {
		return (
			<div
				className="container mt-5 alert alert-danger"
				role="alert"
				aria-live="assertive"
			>
				{error}
			</div>
		);
	}

	return (
		<div className="container mt-5">
			<div className="d-flex justify-content-between align-items-center">
				<h1 tabIndex={-1}>Copies of {title}</h1>
				<Button
					variant="primary"
					onClick={() => setShowModal(true)}
					aria-label="Add New Copy"
				>
					Add New Copy
				</Button>
			</div>

			<div
				className="mt-3 row align-items-center g-2"
				role="region"
				aria-label="Filters"
			>
				<div className="col-12 col-sm-6 col-md-4">
					<input
						type="text"
						name="barcode"
						id="barcode"
						placeholder="Type copy barcode"
						className="form-control mb-2"
						value={barcodeFilter}
						onChange={(e) => setBarcodeFilter(e.target.value)}
						aria-label="Filter by barcode"
					/>
				</div>
				<div className="col-12 col-sm-auto">
					<Button
						variant="secondary"
						size="sm"
						className="mb-2 me-sm-3"
						onClick={() => setBarcodeFilter("")}
						aria-label="Reset barcode filter"
					>
						Reset
					</Button>
				</div>
				<div className="col-12 col-sm-6 col-md-4">
					<select
						id="librarySelect"
						className="form-control mb-2"
						value={libraryFilter}
						onChange={(e) => setLibraryFilter(e.target.value)}
						aria-label="Filter by library"
					>
						<option value="">Select a library</option>
						{managedLibraries.map((libraryName, i) => (
							<option key={i} value={libraryName}>
								{libraryName}
							</option>
						))}
					</select>
				</div>
				<div className="col-12 col-sm-auto">
					<Button
						variant="secondary"
						size="sm"
						className="mb-2 me-sm-3"
						onClick={() => setLibraryFilter("")}
						aria-label="Reset library filter"
					>
						Reset
					</Button>
				</div>
			</div>

			<InfiniteScroll
				dataLength={copies.length}
				next={fetchMoreCopies}
				hasMore={copies.length % 30 === 0 && copies.length > 0}
				loader={<Loading />}
				endMessage={
					<p className="text-center my-2" role="status">
						There aren't more copies
					</p>
				}
			>
				<ul className="list-group mt-3" role="list">
					{copies.map((copy) => (
						<li
							key={copy.id}
							className="list-group-item d-flex align-items-center flex-wrap"
							style={{ padding: "10px" }}
							role="listitem"
						>
							<div className="col-md-2">
								<strong id={`barcode-label-${copy.id}`}>Barcode:</strong>{" "}
								<span aria-labelledby={`barcode-label-${copy.id}`}>
									{copy.barcode}
								</span>
							</div>
							<div className="col-md-2">
								<strong id={`available-label-${copy.id}`}>Available:</strong>{" "}
								<span
									aria-labelledby={`available-label-${copy.id}`}
									style={{
										color: copy.loanUser === "none" ? "#198754" : "#dc3545",
									}}
								>
									{copy.loanUser === "none" ? "Yes" : "No"}
								</span>
							</div>
							<div className="col-md-3">
								<strong id={`library-label-${copy.id}`}>Library:</strong>{" "}
								<span aria-labelledby={`library-label-${copy.id}`}>
									{copy.libraryName}
								</span>
							</div>
							<div className="col-md-3">
								{copy.reserveUser !== "none" ? (
									<span className="text-warning" aria-live="polite">
										Reserved by: {copy.reserveUser}
									</span>
								) : copy.loanUser !== "none" ? (
									<span className="text-info" aria-live="polite">
										Loaned to: {copy.loanUser}
									</span>
								) : (
									<span>No current reservation or loan</span>
								)}
							</div>
							<div className="col-md-2 text-end d-flex justify-content-between">
								<Button
									variant="warning"
									size="sm"
									className="me-1"
									onClick={() =>
										handleChangeLibrary(copy.id, copy.barcode, copy.libraryName)
									}
									aria-label={`Update copy with barcode ${copy.barcode}`}
								>
									Update
								</Button>
								<Button
									variant="danger"
									size="sm"
									onClick={() => openDeleteModal(copy.id)}
									aria-label={`Delete copy with barcode ${copy.barcode}`}
								>
									Delete
								</Button>
							</div>
						</li>
					))}
				</ul>
			</InfiniteScroll>

			<DeleteConfirmationModal
				show={showDeleteModal}
				onClose={closeDeleteModal}
				onDelete={handleDeleteCopy}
				message="Are you sure you want to delete this copy?"
				aria-modal="true"
			/>

			<CreateCopyModal
				showModal={showModal}
				setShowModal={setShowModal}
				newCopy={newCopy}
				setNewCopy={setNewCopy}
				libraries={managedLibraries}
				handleAddCopy={handleAddCopy}
				aria-modal="true"
			/>

			<ChangeLibraryModal
				showChangeLibraryModal={showChangeLibraryModal}
				setShowChangeLibraryModal={setShowChangeLibraryModal}
				selectedLibrary={selectedLibrary}
				setSelectedLibrary={setSelectedLibrary}
				selectedBarcode={selectedBarcode}
				setSelectedBarcode={setSelectedBarcode}
				libraries={managedLibraries}
				submitChangeLibrary={handleUpdate}
				aria-modal="true"
			/>
		</div>
	);
}
