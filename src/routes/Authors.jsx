import { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import AddAttributeWithDateModal from "../components/modals/AddAttributeWithDateModal";
import EditAttributeWithDateModal from "../components/modals/EditAttributeWithDateModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const AuthorsComponent = () => {
  const [authors, setAuthors] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (page === 0) setAuthors([]);
    fetchAuthors(page);
  }, [page]);

  const fetchAuthors = useCallback(
    async (currentPage) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const params = new URLSearchParams({ page: currentPage, size: "30" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = await fetchData(
          `/authors?${params.toString()}`,
          "GET",
          null,
          token
        );
        const newAuthors = data?.message || [];
        setAuthors((prev) =>
          currentPage === 0 ? newAuthors : [...prev, ...newAuthors]
        );
      } catch (err) {
        toast.error(err.message || "Failed to load authors.");
      } finally {
        setIsFetching(false);
      }
    },
    [token, isFetching]
  );

  const handleSaveAuthor = async (method, body) => {
    try {
      await fetchData("/authors", method, body, token);
      toast.success(
        `Author ${method === "POST" ? "added" : "updated"} successfully!`
      );
      setModals({ ...modals, add: false, edit: false });
      setPage(0);
      fetchAuthors(0);
    } catch (err) {
      toast.error(err.message || "Failed to save author.");
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await fetchData(`/authors/${selectedAuthor.id}`, "DELETE", null, token);
      toast.success("Author deleted successfully!");
      setModals({ ...modals, delete: false });
      setPage(0);
      fetchAuthors(0);
    } catch (err) {
      toast.error(err.message || "Failed to delete author.");
    }
  };

  return (
    <main className="container" style={{ overflowX: "hidden" }}>
      <InfiniteScroll
        dataLength={authors.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={!isFetching && authors.length % 30 === 0}
        loader={<Loading />}
        endMessage={
          <p className="text-center mt-3 text-muted">
            No more authors to load.
          </p>
        }
      >
        <section className="row w-100">
          {authors.map((author) => (
            <div key={author.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <article className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title text-truncate">{author.name}</h5>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => {
                        setSelectedAuthor(author);
                        setModals({ ...modals, edit: true });
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setSelectedAuthor(author);
                        setModals({ ...modals, delete: true });
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </section>
      </InfiniteScroll>

      <button
        className="btn btn-primary fixed-bottom m-3 w-25"
        onClick={() => setModals({ ...modals, add: true })}
      >
        + Add Author
      </button>

      <EditAttributeWithDateModal
        show={modals.edit}
        handleClose={() => setModals({ ...modals, edit: false })}
        handleUpdateAttribute={(id, name, birthDate) =>
          handleSaveAuthor("PUT", { authorId: id, name, birthDate })
        }
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
        handleAdd={(name, birthDate) =>
          handleSaveAuthor("POST", { name, birthDate })
        }
      />
    </main>
  );
};

export default AuthorsComponent;
