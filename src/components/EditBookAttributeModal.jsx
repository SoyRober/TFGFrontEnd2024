import React from "react";

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
  if (!editingAttribute) return null;

  let inputField;
  console.log("🚀 ~ EditBookAttributeModal");

  switch (editingAttribute) {
    case "authors":
      inputField = (
        <select
          multiple
          className="form-control"
          id="editValue"
          value={selectedAuthors}
          onChange={handleAuthorChange}
          required
        >
          {authors.map((author, index) => (
            <option key={index} value={author}>
              {author}
            </option>
          ))}
        </select>
      );
      break;
    case "genres":
      inputField = (
        <select
          multiple
          className="form-control"
          id="editGenres"
          value={selectedGenres}
          onChange={handleGenreChange}
          required
        >
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
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
