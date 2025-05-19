import YearSelector from "./YearSelector";
import ResetButtonFilter from "./ResetButtonFilter";

export default function Filters({
  startDateFilter,
  setStartDateFilter,
  searchTermTitle,
  setSearchTermTitle,
  searchTermAuthor,
  setSearchTermAuthor,
  searchTermGenre,
  setSearchTermGenre,
  fetchBooksData,
  bookData,
  setBookData,
  isAdultUser,
}) {
  return (
    <form className="row w-100 justify-content-center" aria-label="Book Filters Form">
      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <div style={{ flexGrow: 1 }}>
          <YearSelector
            yearsCount={200}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            fetchBooksData={fetchBooksData}
          />
        </div>
        <ResetButtonFilter
          onClick={() => {
            setStartDateFilter("");
            fetchBooksData(0);
          }}
          ariaLabel="Reset Year Filter Button"
        />
      </div>

      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search books..."
          value={searchTermTitle}
          onChange={(e) => setSearchTermTitle(e.target.value)}
          aria-label="Title Filter Input"
          style={{ flexGrow: 1 }}
        />
        <ResetButtonFilter
          onClick={() => {
            setSearchTermTitle("");
            fetchBooksData(0);
          }}
          ariaLabel="Reset Title Filter Button"
        />
      </div>

      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by author"
          value={searchTermAuthor}
          onChange={(e) => setSearchTermAuthor(e.target.value)}
          aria-label="Author Filter Input"
          style={{ flexGrow: 1 }}
        />
        <ResetButtonFilter
          onClick={() => {
            setSearchTermAuthor("");
            fetchBooksData(0);
          }}
          ariaLabel="Reset Author Filter Button"
        />
      </div>

      {isAdultUser && (
        <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
          <select
            className="form-control"
            value={bookData.isAdult}
            onChange={(e) => setBookData({ ...bookData, isAdult: e.target.value })}
            aria-label="Adult Content Filter Dropdown"
            style={{ flexGrow: 1 }}
          >
            <option value="both" aria-label="Both Content Option">Both</option>
            <option value="false" aria-label="Non-Adult Content Option">Non-Adult Content</option>
            <option value="true" aria-label="Adult Content Option">Adult Content</option>
          </select>
          <ResetButtonFilter
            onClick={() => {
              setBookData({ ...bookData, isAdult: "both" });
              fetchBooksData(0);
            }}
            ariaLabel="Reset Adult Content Filter Button"
          />
        </div>
      )}

      <div className="col-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by genre"
          value={searchTermGenre}
          onChange={(e) => setSearchTermGenre(e.target.value)}
          aria-label="Genre Filter Input"
          style={{ flexGrow: 1 }}
        />
        <ResetButtonFilter
          onClick={() => {
            setSearchTermGenre("");
            fetchBooksData(0);
          }}
          ariaLabel="Reset Genre Filter Button"
        />
      </div>

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
