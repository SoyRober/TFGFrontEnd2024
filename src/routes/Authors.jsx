import { useEffect, useState, useCallback } from "react";
import { fetchData } from "../utils/fetch";
import { useNavigate } from "react-router-dom";
import { hasAuthorization } from "../utils/auth";
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
  const [nameFilter, setNameFilter] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasAuthorization(["librarian", "admin"])) navigate("/");
  }, [navigate]);

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
        if (nameFilter) params.append("name", nameFilter);

        const data = await fetchData(
          `/public/authors?${params.toString()}`,
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
    [token, isFetching, nameFilter]
  );

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      setPage(0);
      fetchAuthors(0);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [nameFilter]);

  const handleSaveAuthor = async (method, body) => {
    try {
      await fetchData("/librarian/authors", method, body, token);
      toast.success(
        `Author ${method === "POST" ? "added" : "updated"} successfully!`
      );
      setModals({ add: false, edit: false, delete: false });
      setPage(0);
      fetchAuthors(0);
    } catch (err) {
      toast.error(err.message || "Failed to save author.");
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await fetchData(
        `/librarian/authors/${selectedAuthor.id}`,
        "DELETE",
        null,
        token
      );
      toast.success("Author deleted successfully!");
      setModals({ add: false, edit: false, delete: false });
      setPage(0);
      fetchAuthors(0);
    } catch (err) {
      toast.error(err.message || "Failed to delete author.");
    }
  };

  return (
    <main
      className="container py-4"
      style={{ overflowX: "hidden" }}
      aria-label="Authors Page"
      tabIndex={-1}
    >
      <div className="d-flex justify-content-center align-items-center mb-3">
        <div className="w-75 d-flex align-items-center justify-content-center">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Filter by name or surname"
            className="form-control mx-2"
            style={{ flex: 1 }}
            onChange={(e) => {
              setNameFilter(e.target.value || "");
            }}
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={authors.length}
        next={() => setPage((p) => p + 1)}
        hasMore={!isFetching && authors.length % 30 === 0 && authors.length > 0}
        loader={
          <div className="d-flex justify-content-center my-4">
            <Loading aria-label="Loading Spinner" />
          </div>
        }
        endMessage={
          <p
            className="text-center mt-3 text-muted"
            role="status"
            aria-live="polite"
          >
            No more authors to load.
          </p>
        }
      >
        <section className="row w-100 g-3" aria-label="Authors List">
          {authors.map((author) => (
            <div
              key={author.id}
              className="col-lg-4 col-md-6 col-sm-12"
              role="listitem"
              aria-label={`Author: ${author.name}`}
            >
              <article className="card h-100 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h2
                    className="card-title mb-0 text-truncate me-3 flex-grow-1 fs-5"
                    style={{ minWidth: 0 }}
                    tabIndex={0}
                  >
                    {author.name}
                  </h2>
                  <div className="d-flex flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        setSelectedAuthor(author);
                        setModals({ ...modals, edit: true });
                      }}
                      aria-label={`Edit author ${author.name}`}
                    >
                      <img
                        src="/img/attributes/fa-pencil.svg"
                        alt="Edit"
                        width={20}
                        height={25}
                        aria-hidden="true"
                        focusable="false"
                      />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                      onClick={() => {
                        setSelectedAuthor(author);
                        setModals({ ...modals, delete: true });
                      }}
                      aria-label={`Delete author ${author.name}`}
                    >
                      <img
                        src="/img/attributes/fa-xmark.svg"
                        alt="Delete"
                        width={20}
                        height={25}
                        aria-hidden="true"
                        focusable="false"
                      />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </section>
      </InfiniteScroll>

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary position-fixed bottom-0 start-0 m-4 px-4 py-2 shadow"
          style={{ zIndex: 1050, minWidth: "200px" }}
          onClick={() => setModals({ ...modals, add: true })}
          aria-label="Add author"
        >
          + Add Author
        </button>
      </div>

      <EditAttributeWithDateModal
        show={modals.edit}
        handleClose={() => setModals({ ...modals, edit: false })}
        handleUpdateAttribute={(id, name, birthDate) =>
          handleSaveAuthor("PUT", { authorId: id, name, birthDate })
        }
        attribute={selectedAuthor}
        aria-modal="true"
      />

      <DeleteConfirmationModal
        show={modals.delete}
        onClose={() => setModals({ ...modals, delete: false })}
        onDelete={handleDeleteAuthor}
        message={`Delete ${selectedAuthor?.name}? This action will also remove it from all books.`}
        aria-modal="true"
        aria-label="Delete confirmation"
      />

      <AddAttributeWithDateModal
        show={modals.add}
        handleClose={() => setModals({ ...modals, add: false })}
        handleAdd={(name, birthDate) =>
          handleSaveAuthor("POST", { name, birthDate })
        }
        aria-modal="true"
        aria-label="Add author"
      />
    </main>
  );
};

export default AuthorsComponent;
