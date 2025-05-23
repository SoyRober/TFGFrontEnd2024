import { Link } from "react-router-dom";
import defaultBook from "/img/defaultBook.svg";

export default function BookCardLoans({ loan, cardSize }) {
  const getColumnClass = (size) => {
    switch (size) {
      case "small":
        return "col-12 col-sm-6 col-md-4 col-lg-3";
      case "medium":
        return "col-12 col-sm-6 col-md-6 col-lg-4";
      case "large":
        return "col-12 col-md-6";
      default:
        return "col-12";
    }
  };

  const getTextSizeClass = (size) => {
    switch (size) {
      case "small":
        return "fs-6";
      case "medium":
        return "fs-5";
      case "large":
        return "fs-4";
      default:
        return "fs-6";
    }
  };

  const imageUrl = loan.bookImage
    ? `data:image/jpeg;base64,${loan.bookImage}`
    : defaultBook;

  return (
    <article
      className={`${getColumnClass(cardSize)} mb-4`}
      aria-label={`Loan card for the book ${loan.book}`}
      aria-describedby={`loan-title-${loan.book
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <div className="customized-card h-100">
        <figure className="p-1">
          <Link
            to={`/viewBook/${loan.book}`}
            className="text-decoration-none"
            aria-label={`View details for the book ${loan.book}`}
          >
            <h3
              id={`loan-title-${loan.book.replace(/\s+/g, "-").toLowerCase()}`}
              className="card-title mb-3 text-truncate"
              style={{
                maxWidth: "100%",
                fontSize:
                  cardSize === "small"
                    ? "1.2em"
                    : cardSize === "medium"
                    ? "1.5em"
                    : "1.8em",
              }}
              title={loan.book} // tooltip con título completo
            >
              <strong>
                {loan.book.length > 30
                  ? loan.book.slice(0, 30) + "..."
                  : loan.book}
              </strong>
            </h3>
          </Link>
        </figure>
        <div className="d-flex justify-content-center">
          <hr
            className="my-1"
            style={{ borderTop: "1px solid black", width: "80%" }}
          />
        </div>
        <div className="card-body text-center">
          <h3
            id={`loan-title-${loan.book.replace(/\s+/g, "-").toLowerCase()}`}
            className="card-title mb-3 text-truncate"
            style={{
              maxWidth: "100%",
              fontSize:
                cardSize === "small"
                  ? "1.2em"
                  : cardSize === "medium"
                  ? "1.5em"
                  : "1.8em",
            }}
            title={loan.book}
          >
            <strong>
              {loan.book.length > 30
                ? loan.book.slice(0, 30) + "..."
                : loan.book}
            </strong>
          </h3>

          <p className={getTextSizeClass(cardSize)}>
            <strong>Start Date:</strong>{" "}
            <time dateTime={new Date(loan.startDate).toISOString()}>
              {new Date(loan.startDate).toLocaleDateString("es-ES")}
            </time>
          </p>
          <p className={getTextSizeClass(cardSize)}>
            <strong>Return Date:</strong>{" "}
            {loan.returnDate ? (
              <time dateTime={new Date(loan.returnDate).toISOString()}>
                {new Date(loan.returnDate).toLocaleDateString("es-ES")}
              </time>
            ) : (
              "N/A"
            )}
          </p>
          <p className={getTextSizeClass(cardSize)}>
            <strong>Returned:</strong> {loan.isReturned ? "Sí" : "No"}
          </p>
        </div>
      </div>
    </article>
  );
}
