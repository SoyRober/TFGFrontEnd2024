import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import SelectableList from "../SelectableList.jsx";
import { compressImage } from "../../utils/compressImage.js";

export default function CreateBookModal({
	showModal,
	closeModal,
	handleSave,
	bookData,
	setBookData,
	authors,
	genres,
}) {
	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setBookData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageResized = await compressImage(file, 200, 200);
			setBookData((prev) => ({ ...prev, image: imageResized }));
		} else {
			setBookData((prev) => ({ ...prev, image: null }));
		}
	};

	const handleAddItem = (key, item) => {
		console.log("Adding item:", item); // Verifica el valor aquí
		if (item && !bookData[key].includes(item)) {
			setBookData((prev) => ({
				...prev,
				[key]: [...prev[key], item],
			}));
		}
	};

	const handleRemoveItem = (key, item) => {
		setBookData((prev) => ({
			...prev,
			[key]: prev[key].filter((i) => i !== item),
		}));
	};

	const onSave = () => {
		handleSave();
		closeModal();
	};

	return (
		<Modal show={showModal} onHide={closeModal} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>Create New Book</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3" controlId="bookTitle">
								<Form.Label>Book Title:</Form.Label>
								<Form.Control
									type="text"
									name="title"
									value={bookData.title}
									onChange={handleInputChange}
									placeholder="Book Title"
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookAuthors">
								<Form.Label>Book Authors:</Form.Label>
								<SelectableList
									label="Author"
									items={authors}
									selectedItems={bookData.authors}
									handleAddItem={(item) => handleAddItem("authors", item)}
									handleRemoveItem={(item) => handleRemoveItem("authors", item)}
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookGenres">
								<Form.Label>Book Genres:</Form.Label>
								<SelectableList
									label="Genre"
									items={genres}
									selectedItems={bookData.genres}
									handleAddItem={(item) => handleAddItem("genres", item)}
									handleRemoveItem={(item) => handleRemoveItem("genres", item)}
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-3" controlId="bookLocation">
								<Form.Label>Book Location:</Form.Label>
								<Form.Control
									type="text"
									name="location"
									value={bookData.location}
									onChange={handleInputChange}
									placeholder="Corridor A, Shelf 1."
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookSynopsis">
								<Form.Label>Book Synopsis:</Form.Label>
								<Form.Control
									as="textarea"
									name="synopsis"
									value={bookData.synopsis}
									onChange={handleInputChange}
									placeholder="In this book, you will learn..."
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookPublicationDate">
								<Form.Label>Book Publication Date:</Form.Label>
								<Form.Control
									type="date"
									name="publicationDate"
									value={bookData.publicationDate}
									onChange={handleInputChange}
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookIsAdult">
								<Form.Label>Is Adult:</Form.Label>
								<Form.Check
									type="checkbox"
									name="isAdult"
									checked={bookData.isAdult}
									onChange={handleInputChange}
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="bookImage">
								<Form.Label>Book Image: (Optional)</Form.Label>
								<Form.Control type="file" onChange={handleImageChange} />
							</Form.Group>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={closeModal}>
					Cancel
				</Button>
				<Button variant="primary" onClick={onSave}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
