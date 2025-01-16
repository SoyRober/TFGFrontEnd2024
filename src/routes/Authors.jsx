import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch";
import Notification from "../components/Notification";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import RenameAttributeModal from "../components/RenameAttributeModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import AddAttributeModal from "../components/AddAttributeModal"; // Importa el nuevo componente

const AuthorsComponent = () => {
  const [authors, setAuthors] = useState([]);
  const [message, setMessage] = useState("");
  const [token] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para el modal de añadir género
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await fetchData(`/getAuthors`, "GET", null, token);
        setAuthors(data);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchAuthors();
  }, [token]);

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);
    console.log("🚀 ~ handleEditAuthor ~ author:", author);

    setShowRenameModal(true);
  };

  const handleRenameAuthor = async (id, name) => {
    console.log("🚀 ~ handleRenameAuthor ~ name:", name);
    console.log("🚀 ~ handleRenameAuthor ~ id:", id);
    try {
      const response = await fetchData(
        `/editAuthor`,
        "POST",
        { authorId: id, name: name, birthDate: null },
        token
      );
      setMessage(response.message);
      setShowRenameModal(false);
      // Refresh authors list
      const data = await fetchData(`/getAuthors`, "GET", null, token);
      setAuthors(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddAuthor = async (name) => {
    try {
      const response = await fetchData(`/addAuthor`, "POST", name, token);
      setMessage(response.message);
      setShowAddModal(false);
      // Refresh authors list
      const data = await fetchData(`/getAuthors`, "GET", null, token);
      setAuthors(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteAuthor = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetchData(
        `/deleteAuthor?authorId=${selectedAuthor.id}`,
        "DELETE",
        null,
        token
      );
      setMessage(response.message);
      setShowDeleteModal(false);
      // Refresh authors list
      const data = await fetchData(`/getAuthors`, "GET", null, token);
      setAuthors(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      {message && <Notification message={message} />}

      <div className="row">
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{author.name}</h5>
                  <h5 className="card-title">{author.birthDate}</h5>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEditAuthor(author)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteAuthor(author)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading authors...</p>
        )}
      </div>

      <button
        className="btn btn-primary"
        style={{ position: "fixed", bottom: "30px", left: "30px" }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Author
      </button>

      {selectedAuthor && (
        <RenameAttributeModal
          show={showRenameModal}
          handleClose={() => setShowRenameModal(false)}
          handleRename={handleRenameAuthor}
          attribute={selectedAuthor}
        />
      )}

      {selectedAuthor && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleConfirmDelete}
          message={`Delete ${selectedAuthor.name}? This action will also remove it from all books.`}
        />
      )}

      {
        <AddAttributeModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleAdd={handleAddAuthor}
        />
      }
    </div>
  );
};

export default AuthorsComponent;
