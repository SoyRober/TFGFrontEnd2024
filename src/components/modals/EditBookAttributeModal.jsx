import { useState } from "react";
import SelectableList from "../navbar/SelectableList.jsx";

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
    handleLibraryChange,
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

    const handleAddLibrary = (library) => {
        if (library && !selectedLibraries.includes(library)) {
            handleLibraryChange({
                target: {
                    options: [...selectedLibraries, library].map((l) => ({
                        selected: true,
                        value: l,
                    })),
                },
            });
            setNewLibrary("");
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
                    aria-label="Edit Authors"
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
                    aria-label="Edit Genres"
                />
            );
            break;
        case "libraries":
            inputField = (
                <SelectableList
                    label="Library"
                    items={libraries}
                    selectedItems={selectedLibraries}
                    handleAddItem={handleAddLibrary}
                    handleRemoveItem={handleRemoveLibrary}
                    aria-label="Edit Libraries"
                />
            );
            break;
        case "quantity":
            inputField = (
                <input
                    type="number"
                    className="form-control"
                    id="editValue"
                    value={editValue}
                    onChange={handleEditChange}
                    required
                    aria-label="Edit Quantity"
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
                    aria-label="Edit Is Adult"
                >
                    <option value="false" aria-label="No">No</option>
                    <option value="true" aria-label="Yes">Yes</option>
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
                    aria-label="Edit Publication Date"
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
                    aria-label="Edit Image"
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
                    aria-label="Edit Value"
                />
            );
    }
    return (
        <div className="modal show" style={{ display: "block" }} aria-label="Edit Book Attribute Modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" aria-label={`Edit ${editingAttribute} Title`}>
                            Edit {editingAttribute}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                            aria-label="Close Modal Button"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleEditSubmit} aria-label="Edit Book Attribute Form">
                            <div className="form-group">
                                <label htmlFor="editValue" aria-label="New Value Label">
                                    New Value
                                </label>
                                {inputField}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                                aria-label="Save Changes Button"
                            >
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
