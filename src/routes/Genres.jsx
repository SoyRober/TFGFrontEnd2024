import { useEffect, useState, useCallback } from "react";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import RenameAttributeModal from "../components/modals/RenameAttributeModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import AddAttributeModal from "../components/modals/AddAttributeModal";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const GenresComponent = () => {
  const [genres, setGenres] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (page === 0) setGenres([]);
    fetchGenres(page);
  }, [page]);

  const fetchGenres = useCallback(
    async (currentPage) => {
      if (isFetching) return;
      setIsFetching(true);
      try {
        const params = new URLSearchParams({ page: currentPage, size: "30" });
        if (nameFilter) params.append("name", nameFilter);

        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = await fetchData(
          `/public/genres?${params.toString()}`,
          "GET",
          null,
          token
        );
        const newGenres = data.message || [];
        setGenres((prev) =>
          currentPage === 0 ? newGenres : [...prev, ...newGenres]
        );
      } catch (err) {
        toast.error(err.message || "Failed to load genres.");
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
      fetchGenres(0);
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [nameFilter]);

  const handleAddGenre = async (newName) => {
    try {
      await fetchData("/librarian/genres", "POST", newName, token);
      toast.success("Genre added successfully!");
      setModals({ ...modals, add: false, edit: false });
      setPage(0);
      fetchGenres(0);
    } catch (err) {
      toast.error(err.message || "Failed to save genre.");
    }
  };

  const handleEditGenre = async (id, name) => {
    const body = { id, name };
    try {
      await fetchData("/librarian/genres", "PUT", body, token);
      toast.success("Genre updated successfully!");
      setModals({ ...modals, add: false, edit: false });
      setPage(0);
      fetchGenres(0);
    } catch (err) {
      toast.error(err.message || "Failed to save genre.");
    }
  };

  const handleDeleteGenre = async () => {
    try {
      await fetchData(
        `/librarian/genres/${selectedGenre.id}`,
        "DELETE",
        null,
        token
      );
      toast.success("Genre deleted successfully!");
      setModals({ ...modals, delete: false });
      setPage(0);
      fetchGenres(0);
    } catch (err) {
      toast.error(err.message || "Failed to delete genre.");
    }
  };

  return (
    <main
      className="container py-4"
      style={{ overflowX: "hidden" }}
      aria-label="Genres Page"
      tabIndex={-1}
    >
      <div className="d-flex justify-content-center align-items-center mb-3">
        <div className="w-75 d-flex align-items-center justify-content-center">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Filter by name"
            className="form-control mx-2"
            style={{ flex: 1 }}
            onChange={(e) => setNameFilter(e.target.value || "")}
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={genres.length}
        next={() => setPage((p) => p + 1)}
        hasMore={!isFetching && genres.length % 30 === 0 && genres.length > 0}
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
            tabIndex={0}
          >
            No more genres to load.
          </p>
        }
      >
        <section className="row w-100 g-3" aria-label="Genres List">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="col-lg-4 col-md-6 col-sm-12"
              role="listitem"
              aria-label={`Genre: ${genre.name}`}
            >
              <article className="card h-100 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h2
                    className="card-title mb-0 text-truncate me-3 flex-grow-1 fs-5"
                    style={{ minWidth: 0 }}
                    tabIndex={0}
                  >
                    {genre.name}
                  </h2>
                  <div className="d-flex flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        setSelectedGenre(genre);
                        setModals({ ...modals, edit: true });
                      }}
                      aria-label={`Edit genre ${genre.name}`}
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
                        setSelectedGenre(genre);
                        setModals({ ...modals, delete: true });
                      }}
                      aria-label={`Delete genre ${genre.name}`}
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
          aria-label="Add genre"
        >
          + Add Genre
        </button>
      </div>

      <RenameAttributeModal
        show={modals.edit}
        handleClose={() => setModals({ ...modals, edit: false })}
        handleRename={handleEditGenre}
        attribute={selectedGenre}
        aria-label="Edit genre modal"
      />

      <DeleteConfirmationModal
        show={modals.delete}
        onClose={() => setModals({ ...modals, delete: false })}
        onDelete={handleDeleteGenre}
        message={`Delete ${selectedGenre?.name}? This action will also remove it from all books.`}
        aria-label="Delete genre confirmation modal"
      />

      <AddAttributeModal
        show={modals.add}
        handleClose={() => setModals({ ...modals, add: false })}
        handleAdd={handleAddGenre}
        aria-label="Add genre modal"
      />
    </main>
  );
};

export default GenresComponent;
