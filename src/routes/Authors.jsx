import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "../styles/loading.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import AddAttributeWithDateModal from "../components/AddAttributeWithDateModal";
import EditAttributeWithDateModal from "../components/EditAttributeWithDateModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Loading from "../components/Loading";

const AuthorsComponent = () => {
  const [authors, setAuthors] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [modals, setModals] = useState({ add: false, edit: false, delete: false });
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, [token]);

  const fetchAuthors = async () => {
    try {
      const data = await fetchData("/authors", "GET", null, token);
      setAuthors(data);
    } catch (err) {
      toast.error(err.message || "Failed to load authors.");
    }
  };

  const handleSaveAuthor = async (method, body) => {
    try {
      await fetchData("/authors", method, body, token);
      toast.success(`Author ${method === "POST" ? "added" : "updated"} successfully!`);
      setModals({ ...modals, add: false, edit: false });
      fetchAuthors();
    } catch (err) {
      toast.error(err.message || "Failed to save author.");
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await fetchData(`/authors/${selectedAuthor.id}`, "DELETE", null, token);
      toast.success("Author deleted successfully!");
      setModals({ ...modals, delete: false });
      fetchAuthors();
    } catch (err) {
      toast.error(err.message || "Failed to delete author.");
    }
  };

  return (
    <main className="container">
      <section className="row">
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <article className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{author.name}</h5>
                  <div>
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => {
                      setSelectedAuthor(author);
                      setModals({ ...modals, edit: true });
                    }}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => {
                      setSelectedAuthor(author);
                      setModals({ ...modals, delete: true });
                    }}>
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </section>

      <button className="btn btn-primary fixed-bottom m-3 w-25" onClick={() => setModals({ ...modals, add: true })}>
        + Add Author
      </button>

      <EditAttributeWithDateModal
        show={modals.edit}
        handleClose={() => setModals({ ...modals, edit: false })}
        handleUpdateAttribute={(id, name, birthDate) => handleSaveAuthor("PUT", { authorId: id, name, birthDate })}
        attribute={selectedAuthor}
      />

      <DeleteConfirmationModal
        show={modals.delete}
        onClose={() => setModals({ ...modals, delete: false })}
        onDelete={handleDeleteAuthor}
        message={`Delete ${selectedAuthor?.name}? This action will also remove it from all books.`}
      />

      <AddAttributeWithDateModal
        show={modals.add}
        handleClose={() => setModals({ ...modals, add: false })}
        handleAdd={(name, birthDate) => handleSaveAuthor("POST", { name, birthDate })}
      />
    </main>
  );
};

export default AuthorsComponent;
