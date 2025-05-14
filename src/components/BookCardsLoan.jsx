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

  const imageUrl = loan.bookImage
    ? `data:image/jpeg;base64,${loan.bookImage}`
    : defaultBook;

  return (
    <article
      className={`${getColumnClass(cardSize)} mb-4`}
      aria-label={`Loan card for the book ${loan.book}`}
    >
      <div className="customized-card h-100">
        <figure className="p-1">
          <img
            src={imageUrl}
            className="card-img-top mx-auto img-custom"
            alt={`Cover of ${loan.book}`}
            aria-label={`Cover image of the book ${loan.book}`}
          />
        </figure>
        <div className="d-flex justify-content-center">
          <hr
            className="my-1"
            style={{ borderTop: "1px solid black", width: "80%" }}
          />
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">
            <Link
              to={`/viewBook/${loan.book}`}
              className="text-decoration-none"
              aria-label={`View details for the book ${loan.book}`}
            >
              {loan.book}
            </Link>
          </h5>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(loan.startDate).toLocaleDateString("es-ES")}
          </p>
          <p>
            <strong>Return Date:</strong>{" "}
            {loan.returnDate
              ? new Date(loan.returnDate).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
          <p>
            <strong>Returned:</strong> {loan.isReturned ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </article>
  );
}
