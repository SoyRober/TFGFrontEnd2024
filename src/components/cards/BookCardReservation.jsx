import { Link } from "react-router-dom";
import defaultBook from "/img/defaultBook.svg";

export default function BookCardReservation({
  reservation,
  cardSize,
  onCancel,
}) {
  const { bookTitle, image, reservationDate, status } = reservation;

  const sizeMaps = {
    small: {
      height: "350px",
      width: 120,
      imgHeight: 180,
      fontSize: "1.5em",      
      titlePadding: "0.2rem",
      bodyPadding: "0.5rem",  
      lineHeight: "1.2",      
    },
    medium: {
      height: "450px",
      width: 180,
      imgHeight: 250,
      fontSize: "2em",
      titlePadding: "0.3rem",
      bodyPadding: "0.8rem",
      lineHeight: "1.4",
    },
    large: {
      height: "600px",
      width: 300,
      imgHeight: 400,
      fontSize: "2.5em",
      titlePadding: "0.5rem",
      bodyPadding: "1rem",
      lineHeight: "1.6",
    },
  };

  const currentSize = sizeMaps[cardSize] || sizeMaps.medium;
  const imageUrl = image ? `data:image/jpeg;base64,${image}` : defaultBook;

  return (
    <article
      className="mb-4"
      aria-label={`Reservation card for the book ${bookTitle}`}
      aria-describedby={`reservation-title-${bookTitle
        .replace(/\s+/g, "-")
        .toLowerCase()}`}
    >
      <div
        className="customized-card pt-1 shadow-sm"
        style={{
          height: currentSize.height,
          minHeight: currentSize.height,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <figure
          className="d-flex justify-content-center align-items-center pb-2"
          style={{
            height: "55%",
            width: "100%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Link to={`/viewBook/${bookTitle}`} className="text-decoration-none">
            <img
              src={imageUrl}
              alt={`Cover of ${bookTitle}`}
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
          <hr className="my-1" style={{ borderTop: "1px solid black", width: "80%" }} />
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
            {bookTitle}
          </h2>
          
          <p style={{ fontSize: `calc(${currentSize.fontSize} * 0.7)` }}>
            <strong>Reservation Date:</strong>{" "}
            <time dateTime={new Date(reservationDate).toISOString()}>
              {new Date(reservationDate).toLocaleDateString("es-ES")}
            </time>
          </p>
          
          <p style={{ fontSize: `calc(${currentSize.fontSize} * 0.7)` }}>
            <strong>Status:</strong> {status}
          </p>

          {status === "PENDING" && (
            <button
              className="btn btn-primary mt-2"
              style={{ 
                fontSize: `calc(${currentSize.fontSize} * 0.65)`,
                padding: `${currentSize.titlePadding} ${currentSize.bodyPadding}`
              }}
              onClick={() => onCancel(bookTitle)}
            >
              Cancel Reservation
            </button>
          )}
        </div>
      </div>
    </article>
  );
}