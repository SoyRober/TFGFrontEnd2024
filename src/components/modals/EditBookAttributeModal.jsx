import { useEffect, useState } from "react";
import SelectableList from "../SelectableList";

const EditBookAttributeModal = ({
	editingAttribute,
	editValue,
	authors,
	selectedAuthors,
	genres,
	selectedGenres,
	libraries,
	selectedLibraries,
	handleAuthorChange,
	handleGenreChange,
	handleEditChange,
	handleEditSubmit,
	handleCloseModal,
	handleImageChange,
	handleLibraryChange
}) => {
	const [newAuthor, setNewAuthor] = useState("");
	const [newGenre, setNewGenre] = useState("");
	const [newLibrary, setNewLibrary] = useState("");

	if (!editingAttribute) return null;

	const handleRemoveAuthor = (author) => {
		handleAuthorChange({
			target: {
				options: selectedAuthors
					.filter((a) => a !== author)
					.map((a) => ({ selected: true, value: a })),
			},
		});
	};

	const handleRemoveGenre = (genre) => {
		handleGenreChange({
			target: {
				options: selectedGenres
					.filter((g) => g !== genre)
					.map((g) => ({ selected: true, value: g })),
			},
		});
	};

	const handleRemoveLibrary = (library) => {
		handleLibraryChange({
			target: {
				options: selectedLibraries
					.filter((l) => l !== library)
					.map((l) => ({ selected: true, value: l })),
			},
		});
	};

	const handleAddAuthor = (e) => {
		const selectedAuthor = e;
		if (selectedAuthor && !selectedAuthors.includes(selectedAuthor)) {
			handleAuthorChange({
				target: {
					options: [...selectedAuthors, selectedAuthor].map((a) => ({
						selected: true,
						value: a,
					})),
				},
			});
			setNewAuthor("");
		}
	};

	const handleAddGenre = (e) => {
		const selectedGenre = e;
		if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
			handleGenreChange({
				target: {
					options: [...selectedGenres, selectedGenre].map((g) => ({
						selected: true,
						value: g,
					})),
				},
			});
			setNewGenre("");
		}
	};

	const handleAddLibrary = (e) => {
		const selectedLibrary = e;
		if (selectedLibrary && !selectedGenres.includes(selectedLibrary)) {
			handleGenreChange({
				target: {
					options: [...selectedLibraries, selectedLibrary].map((g) => ({
						selected: true,
						value: g,
					})),
				},
			});
			setNewGenre("");
		}
	};

	let inputField;
	switch (editingAttribute) {
		case "authors":
			inputField = (
				<SelectableList
					label="Author"
					items={authors}
					selectedItems={selectedAuthors}
					newItem={newAuthor}
					setNewItem={setNewAuthor}
					handleAddItem={handleAddAuthor}
					handleRemoveItem={handleRemoveAuthor}
				/>
			);
			break;
		case "genres":
			inputField = (
				<SelectableList
					label="Genre"
					items={genres}
					selectedItems={selectedGenres}
					newItem={newGenre}
					setNewItem={setNewGenre}
					handleAddItem={handleAddGenre}
					handleRemoveItem={handleRemoveGenre}
				/>
			);
			break;
			case "libraries":
				
				inputField = (
					<SelectableList
						label="Library"
						items={libraries}
						selectedItems={selectedLibraries}
						newItem={newLibrary}
						setNewItem={setNewLibrary}
						handleAddItem={handleAddLibrary}
						handleRemoveItem={handleRemoveLibrary}
					/>
				);
				break;
		//TODO Fix bookCopies
		case "quantity":
			inputField = (
				<input
					type="number"
					className="form-control"
					id="editValue"
					value={editValue}
					onChange={handleEditChange}
					required
				/>
			);
			break;
		case "isAdult":
			inputField = (
				<select
					className="form-control"
					id="editValue"
					value={editValue}
					onChange={handleEditChange}
					required
				>
					<option value="false">No</option>
					<option value="true">Yes</option>
				</select>
			);
			break;
		case "publicationDate":
			inputField = (
				<input
					type="date"
					className="form-control"
					id="editValue"
					value={editValue}
					onChange={handleEditChange}
					required
				/>
			);
			break;
		case "image":
			inputField = (
				<input
					type="file"
					className="form-control"
					id="editImage"
					onChange={handleImageChange}
					required
				/>
			);
			break;
		default:
			inputField = (
				<input
					type="text"
					className="form-control"
					id="editValue"
					value={editValue}
					onChange={handleEditChange}
					required
				/>
			);
	}
	return (
		<div className="modal show" style={{ display: "block" }}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Edit {editingAttribute}</h5>
						<button
							type="button"
							className="btn-close"
							onClick={handleCloseModal}
						></button>
					</div>
					<div className="modal-body">
						<form onSubmit={handleEditSubmit}>
							<div className="form-group">
								<label htmlFor="editValue">New Value</label>
								{inputField}
							</div>
							<button type="submit" className="btn btn-primary mt-3">
								Save changes
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default EditBookAttributeModal;
