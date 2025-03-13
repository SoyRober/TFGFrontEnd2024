import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch";
import NotificationError from "../components/NotificationError";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import RenameAttributeModal from "../components/RenameAttributeModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import AddAttributeModal from "../components/AddAttributeModal"; // Importa el nuevo componente

const GenresComponent = () => {
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
  const [token] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para el modal de añadir género
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchData(`/getGenres`, "GET", null, token);
        setGenres(data);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchGenres();
  }, [token]);

  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    setShowRenameModal(true);
  };

  const handleRenameGenre = async (id, newName) => {
    try {
      const response = await fetchData(
        `/editGenre`,
        "POST",
        { id, newName },
        token
      );
      setMessage(response.message);
      setShowRenameModal(false);
      // Refresh genres list
      const data = await fetchData(`/getGenres`, "GET", null, token);
      setGenres(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddGenre = async (newName) => {
    try {
      const response = await fetchData(`/addGenre`, "POST", newName, token);
      setMessage(response.message);
      setShowAddModal(false);
      // Refresh genres list
      const data = await fetchData(`/getGenres`, "GET", null, token);
      setGenres(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDeleteGenre = (genre) => {
    setSelectedGenre(genre);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetchData(
        `/deleteGenre?genreId=${selectedGenre.id}`,
        "DELETE",
        null,
        token
      );
      setMessage(response.message);
      setShowDeleteModal(false);
      // Refresh genres list
      const data = await fetchData(`/getGenres`, "GET", null, token);
      setGenres(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="container">
      {message && <NotificationError message={message} />}

      <section className="row">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <div key={genre.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <article className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{genre.name}</h5>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEditGenre(genre)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteGenre(genre)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))
        ) : (
          <p>Loading genres...</p>
        )}
      </section>

      <button
        className="btn btn-primary"
        style={{ position: "fixed", bottom: "30px", left: "30px" }}
        onClick={() => setShowAddModal(true)}
      >
        + Add Genre
      </button>

      {selectedGenre && (
        <RenameAttributeModal
          show={showRenameModal}
          handleClose={() => setShowRenameModal(false)}
          handleRename={handleRenameGenre}
          attribute={selectedGenre}
        />
      )}

      {selectedGenre && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleConfirmDelete}
          message={`Delete ${selectedGenre.name}? This action will also remove it from all books.`}
        />
      )}

      {
        <AddAttributeModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          handleAdd={handleAddGenre}
        />
      }
    </main>
  );
};

export default GenresComponent;
