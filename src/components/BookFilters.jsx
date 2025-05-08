import DatePicker from "react-datepicker";

export default function Filters({
  startDateFilter,
  setStartDateFilter,
  searchTermTitle,
  setSearchTermTitle,
  searchTermAuthor,
  setSearchTermAuthor,
  searchTermGenre,
  setSearchTermGenre,
  resetFilters,
  fetchBooksData,
  bookData,
  setBookData,
  isAdultUser,
  setIsAdultUser,
  setIsAdultUserFilter,
}) {
  return (
    <form className="row w-100 justify-content-center" aria-label="Book Filters Form">
      {/* Filtro por año */}
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <DatePicker
          selected={startDateFilter}
          onChange={(date) => setStartDateFilter(date)}
          className="form-control form-control-sm me-2"
          dateFormat="yyyy"
          placeholderText="Select a year"
          showYearPicker
          aria-label="Year Filter"
        />
        <button
          className="btn btn-outline-secondary bt-sm mx-2"
          type="button"
          onClick={() => {
            setStartDateFilter("");
            fetchBooksData(0);
          }}
          aria-label="Reset Year Filter Button"
        >
          ⟲
        </button>
      </div>

      {/* Filtro por título */}
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control form-control-sm me-2"
          placeholder="Search books..."
          value={searchTermTitle}
          onChange={(e) => setSearchTermTitle(e.target.value)}
          aria-label="Title Filter Input"
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermTitle("");
            fetchBooksData(0);
          }}
          aria-label="Reset Title Filter Button"
        >
          ⟲
        </button>
      </div>

      {/* Filtro por autor */}
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control form-control-sm me-2"
          placeholder="Search by author"
          value={searchTermAuthor}
          onChange={(e) => setSearchTermAuthor(e.target.value)}
          aria-label="Author Filter Input"
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermAuthor("");
            fetchBooksData(0);
          }}
          aria-label="Reset Author Filter Button"
        >
          ⟲
        </button>
      </div>

      {/* Filtro por contenido adulto */}
      {isAdultUser && (
        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
          <select
            className="form-control form-control-sm me-2"
            value={bookData.isAdult}
            onChange={(e) =>
              setBookData({ ...bookData, isAdult: e.target.value })
            }
            aria-label="Adult Content Filter Dropdown"
          >
            <option value="both" aria-label="Both Content Option">
              Both
            </option>
            <option value="false" aria-label="Non-Adult Content Option">
              Non-Adult Content
            </option>
            <option value="true" aria-label="Adult Content Option">
              Adult Content
            </option>
          </select>
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => {
              setBookData({ ...bookData, isAdult: "both" });
              fetchBooksData(0);
            }}
            aria-label="Reset Adult Content Filter Button"
          >
            ⟲
          </button>
        </div>
      )}

      {/* Filtro por género */}
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control form-control-sm me-2"
          placeholder="Search by genre"
          value={searchTermGenre}
          onChange={(e) => setSearchTermGenre(e.target.value)}
          aria-label="Genre Filter Input"
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermGenre("");
            fetchBooksData(0);
          }}
          aria-label="Reset Genre Filter Button"
        >
          ⟲
        </button>
      </div>

      {/* Botón para reiniciar todos los filtros */}
      <div className="col-12 d-flex justify-content-center mt-3">
        <button
          className="btn btn-warning"
          type="button"
          onClick={() => {
            setStartDateFilter("");
            setSearchTermTitle("");
            setSearchTermAuthor("");
            setBookData({ ...bookData, isAdult: "both" });
            setSearchTermGenre("");
            fetchBooksData(0);
          }}
          aria-label="Reset All Filters Button"
        >
          Reset All Filters
        </button>
      </div>
    </form>
  );
}
