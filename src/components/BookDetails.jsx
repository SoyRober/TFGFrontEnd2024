export default function BookDetails({ book, quantity, isLoggedIn, hasPermissions, handleEditClick }) {
  return (
    <div className="col-md-6 mb-3" aria-label="Book Details Section">
      {[
        { label: "Title", value: book.title, key: "title" },
        { label: "Authors", value: book.authors?.join(", ") || "N/A", key: "authors" },
        { label: "Genres", value: book.genres?.join(", ") || "N/A", key: "genres" },
        { label: "Available Copies", value: quantity, key: "quantity" },
        { label: "Location", value: book.location, key: "location" },
        { label: "Synopsis", value: book.synopsis, key: "synopsis" },
        { label: "Publication Date", value: book.publicationDate, key: "publicationDate" },
        { label: "Adult", value: book.adult ? "Yes" : "No", key: "isAdult" },
        { label: "Libraries", value: book.libraries?.join(", ") || "N/A", key: "libraries" },
      ].map(({ label, value, key }) => (
        <div className="mb-2" key={key} aria-label={`${label} Detail`}>
          <p className="mb-0" aria-label={`${label}: ${value}`}>
            <strong>{label}:</strong> {value}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick(key)}
              className="btn btn-primary mt-1"
              aria-label={`Edit ${label} Button`}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
}