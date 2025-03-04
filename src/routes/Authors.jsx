import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch";
import Notification from "../components/Notification";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddAttributeWithDateModal from "../components/AddAttributeWithDateModal";
import EditAttributeWithDateModal from "../components/EditAttributeWithDateModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const AuthorsComponent = () => {
  const [authors, setAuthors] = useState([]);
  const [message, setMessage] = useState("");
  const [token] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await fetchData(`/authors`, "GET", null, token);
        setAuthors(data);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchAuthors();
  }, [token]);

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);

    setShowRenameModal(true);
  };

  const handleUpdateAuthor = async (id, name, birthDate) => {
    try {
      const response = await fetchData(
        `/authors`,
        "PUT",
        { authorId: id, name: name, birthDate: birthDate },
        token
      );
      setMessage(response.message);
      setShowRenameModal(false);
      // Refresh authors list
      const data = await fetchData(`/authors`, "GET", null, token);
      setAuthors(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddAuthor = async (name, birthDate) => {
    try {
      const response = await fetchData(
        `/authors`,
        "POST",
        { name, birthDate },
        token
      );
      setMessage(response.message);
      setShowAddModal(false);
      // Refresh authors list
      const data = await fetchData(`/authors`, "GET", null, token);
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
        `/authors/${selectedAuthor.id}`,
        "DELETE",
        null,
        token
      );
      setMessage(response.message);
      setShowDeleteModal(false);
      // Refresh authors list
      const data = await fetchData(`/authors`, "GET", null, token);
      setAuthors(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="container">
      {message && <Notification message={message} />}

      <section className="row">
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <article className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{author.name}</h5>
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
              </article>
            </div>
          ))
        ) : (
          <p>Loading authors...</p>
        )}
      </section>

      <button
        className="btn btn-primary"
        style={{ position: "fixed", bottom: "30px", left: "30px" }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Author
      </button>

      {selectedAuthor && (
        <EditAttributeWithDateModal
          show={showRenameModal}
          handleClose={() => setShowRenameModal(false)}
          handleUpdateAttribute={handleUpdateAuthor}
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
        <AddAttributeWithDateModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleAdd={handleAddAuthor}
        />
      }
    </main>
  );
};

export default AuthorsComponent;
