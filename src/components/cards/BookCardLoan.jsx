import { Link } from "react-router-dom";
import defaultBook from "/img/defaultBook.svg";

export default function BookCardLoans({ loan, cardSize }) {
  const sizeMaps = {
    small: {
      height: "350px",
      width: 250,
      imgHeight: 180,
      fontSize: "1.5em",
      titlePadding: "0.2rem",
      bodyPadding: "0.5rem",
      lineHeight: "1.2",
    },
    medium: {
      height: "450px",
      width: 300,
      imgHeight: 250,
      fontSize: "2em",
      titlePadding: "0.3rem",
      bodyPadding: "0.8rem",
      lineHeight: "1.4",
    },
    large: {
      height: "600px",
      width: 400,
      imgHeight: 400,
      fontSize: "2.5em",
      titlePadding: "0.5rem",
      bodyPadding: "1rem",
      lineHeight: "1.6",
    },
  };

  const currentSize = sizeMaps[cardSize] || sizeMaps.medium;

  const imageUrl = loan.bookImage
    ? `data:image/jpeg;base64,${loan.bookImage}`
    : defaultBook;

  return (
    <article
      className="mb-4"
      aria-label={`Loan card for the book ${loan.book}`}
      aria-describedby={`loan-title-${loan.book
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <div
        className="customized-card h-100"
        style={{
          height: currentSize.height,
          minHeight: currentSize.height,
          width: "100%",
          maxWidth: "100%",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <figure
          className="p-1"
          style={{
            height: "55%",
            width: "100%",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            to={`/viewBook/${loan.book}`}
            className="text-decoration-none"
            aria-label={`View details for the book ${loan.book}`}
          >
            <img
              src={imageUrl}
              alt={`Cover of ${loan.book}`}
              width={currentSize.width}
              height={currentSize.imgHeight}
              className="shadow"
              style={{
                objectFit: "contain",
                display: "block",
                borderRadius: "4px",
              }}
              loading="lazy"
              decoding="async"
            />
          </Link>
        </figure>

        <div className="d-flex justify-content-center">
          <hr
            className="my-1"
            style={{ borderTop: "1px solid black", width: "80%" }}
          />
        </div>

        <div
          className="card-body text-center"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `0 ${currentSize.bodyPadding} ${currentSize.bodyPadding}`,
            lineHeight: currentSize.lineHeight,
          }}
        >
          <h2
            style={{
              fontWeight: "500",
              fontSize: currentSize.fontSize,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: `0 ${currentSize.titlePadding}`,
              marginBottom: "0.5rem",
            }}
          >
            <strong>{loan.book}</strong>
          </h2>

          <p style={{ fontSize: `calc(${currentSize.fontSize} * 0.7)` }}>
            <strong>Start Date:</strong>{" "}
            <time dateTime={new Date(loan.startDate).toISOString()}>
              {new Date(loan.startDate).toLocaleDateString("es-ES")}
            </time>
          </p>

          <p style={{ fontSize: `calc(${currentSize.fontSize} * 0.7)` }}>
            <strong>Return Date:</strong>{" "}
            {loan.returnDate ? (
              <time dateTime={new Date(loan.returnDate).toISOString()}>
                {new Date(loan.returnDate).toLocaleDateString("es-ES")}
              </time>
            ) : (
              "Without return date"
            )}
          </p>

          <p style={{ fontSize: `calc(${currentSize.fontSize} * 0.7)` }}>
            <strong>Returned:</strong> {loan.isReturned ? "Sí" : "No"}
          </p>
        </div>
      </div>
    </article>
  );
}
