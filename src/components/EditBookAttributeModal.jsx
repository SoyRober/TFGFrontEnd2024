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

  const handleAddAuthor = () => {
    if (newAuthor && !selectedAuthors.includes(newAuthor)) {
      handleAuthorChange({
        target: {
          options: [...selectedAuthors, newAuthor].map((a) => ({
            selected: true,
            value: a,
          })),
        },
      });
      setNewAuthor("");
    }
  };

  const handleAddGenre = () => {
    if (newGenre && !selectedGenres.includes(newGenre)) {
      handleGenreChange({
        target: {
          options: [...selectedGenres, newGenre].map((g) => ({
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
              onChange={(e) => setNewAuthor(e.target.value)}
            >
              <option value="">Select an author</option>
              {authors.map((author, index) => (
                <option key={index} value={author}>
                  {author}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleAddAuthor}
            >
              Add New
            </button>
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
              onChange={(e) => setNewGenre(e.target.value)}
            >
              <option value="">Select a genre</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={handleAddGenre}
            >
              Add New
            </button>
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
