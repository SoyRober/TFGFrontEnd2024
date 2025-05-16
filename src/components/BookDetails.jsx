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
      value: book.authors?.join(", ") || "N/A",
      key: "authors",
    },
    { label: "Genres", value: book.genres?.join(", ") || "N/A", key: "genres" },
    { label: "Available Copies", value: quantity, key: "quantity" },
    { label: "Location", value: book.location || "N/A", key: "location" },
    { label: "Synopsis", value: book.synopsis || "N/A", key: "synopsis" },
    {
      label: "Publication Date",
      value: book.publicationDate
        ? new Date(book.publicationDate).toLocaleDateString("es-ES")
        : "N/A",
      key: "publicationDate",
    },
    { label: "Adult", value: book.adult ? "Sí" : "No", key: "isAdult" },
    {
      label: "Libraries",
      value: book.libraries?.join(", ") || "N/A",
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
            <dt>
              <strong>{label}:</strong>
            </dt>
            <dd>
              {value}
              {isLoggedIn && hasPermissions && (
                <button
                  onClick={() => handleEditClick(key)}
                  className="btn btn-primary ms-2"
                  aria-label={`Editar ${label}`}
                >
                  Edit
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
