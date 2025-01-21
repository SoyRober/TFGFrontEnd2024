import React, { useState } from "react";

const EditBookAttributeModal = ({
  editingAttribute,
  editValue,
  authors,
  selectedAuthors,
  genres,
  selectedGenres,
  handleAuthorChange,
  handleGenreChange,
  handleEditChange,
  handleEditSubmit,
  handleCloseModal,
  handleImageChange,
}) => {
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");

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

  const handleAddAuthor = (e) => {
    const selectedAuthor = e.target.value;
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
    const selectedGenre = e.target.value;
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

  let inputField;
  switch (editingAttribute) {
    case "authors":
      inputField = (
        <>
          <div className="selected-items">
            {selectedAuthors.map((author, index) => (
              <span key={index} className="badge bg-primary me-2">
                {author}{" "}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => handleRemoveAuthor(author)}
                ></button>
              </span>
            ))}
          </div>
          <div className="form-group mt-3">
            <label htmlFor="newAuthor">Add New Author</label>
            <select
              className="form-control"
              id="newAuthor"
              value={newAuthor}
              onChange={handleAddAuthor}
            >
              <option value="">Select an author</option>
              {authors
                .filter((author) => !selectedAuthors.includes(author))
                .map((author, index) => (
                  <option key={index} value={author}>
                    {author}
                  </option>
                ))}
            </select>
          </div>
        </>
      );
      break;
    case "genres":
      inputField = (
        <>
          <div className="selected-items">
            {selectedGenres.map((genre, index) => (
              <span key={index} className="badge bg-primary me-2">
                {genre}{" "}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => handleRemoveGenre(genre)}
                ></button>
              </span>
            ))}
          </div>
          <div className="form-group mt-3">
            <label htmlFor="newGenre">Add New Genre</label>
            <select
              className="form-control"
              id="newGenre"
              value={newGenre}
              onChange={handleAddGenre}
            >
              <option value="">Select a genre</option>
              {genres
                .filter((genre) => !selectedGenres.includes(genre))
                .map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
            </select>
          </div>
        </>
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
