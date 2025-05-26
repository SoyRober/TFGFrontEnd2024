export default function BookDetails({
  book,
  quantity,
  isLoggedIn,
  hasPermissions,
  handleEditClick,
}) {
  const details = [
    { label: "Title", value: book.title, key: "title" },
    {
      label: "Authors",
      value: book.authors?.join(", ") || "Without authors",
      key: "authors",
    },
    { label: "Genres", value: book.genres?.join(", ") || "Without genres", key: "genres" },
    { label: "Available Copies", value: quantity, key: "quantity" },
    { label: "Location", value: book.location || "Without location", key: "location" },
    { label: "Synopsis", value: book.synopsis || "Without synopsis", key: "synopsis" },
    {
      label: "Publication Date",
      value: book.publicationDate
        ? new Date(book.publicationDate).toLocaleDateString("es-ES")
        : "Without publication date",
      key: "publicationDate",
    },
    { label: "Adult", value: book.adult ? "Sí" : "No", key: "isAdult" },
    {
      label: "Libraries",
      value: book.libraries?.join(", ") || "Without libraries",
      key: "libraries",
    },
  ];

  return (
    <section className="col-md-6 mb-3" aria-labelledby="book-details-title">
      <h2 id="book-details-title" className="visually-hidden">
        Book Details Section
      </h2>
      <dl>
        {details.map(({ label, value, key }) => (
          <div className="mb-2" key={key}>
            {key === "synopsis" ? (
              <div>
                <strong>{label}:</strong>
                <div
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    marginTop: "0.25rem",
                  }}
                  aria-label="Scrollable synopsis"
                >
                  {value}
                </div>
              </div>
            ) : (
              <div>
                <strong>{label}:</strong> {value}
              </div>
            )}
            {isLoggedIn && hasPermissions && (
              <div className="mt-1">
                <button
                  onClick={() => handleEditClick(key)}
                  className="btn btn-primary"
                  aria-label={`Editar ${label}`}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
