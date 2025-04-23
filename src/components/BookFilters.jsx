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
  setIsAdultUserFilter
}) {
  return (
    <form className="row w-100 justify-content-center">
      {/* Filtro por año */}
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <DatePicker
          selected={startDateFilter}
          onChange={(date) => setStartDateFilter(date)}
          className="form-control form-control-sm me-2"
          dateFormat="yyyy"
          placeholderText="Select a year"
          showYearPicker
        />
        <button
          className="btn btn-outline-secondary bt-sm mx-2"
          type="button"
          onClick={() => {
            setStartDateFilter("");
            fetchBooksData(0);
          }}
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
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermTitle("");
            fetchBooksData(0);
          }}
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
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermAuthor("");
            fetchBooksData(0);
          }}
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
          >
            <option value="both">Both</option>
            <option value="false">Non-Adult Content</option>
            <option value="true">Adult Content</option>
          </select>
          <button
            className="btn btn-outline-secondary btn-sm"
            type="button"
            onClick={() => {
              setBookData({ ...bookData, isAdult: "both" });
              fetchBooksData(0);
            }}
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
        />
        <button
          className="btn btn-outline-secondary bt-sm"
          type="button"
          onClick={() => {
            setSearchTermGenre("");
            fetchBooksData(0);
          }}
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
        >
          Reset All Filters
        </button>
      </div>
    </form>
  );
}
