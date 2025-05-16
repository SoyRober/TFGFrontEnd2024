export default function CardSizeSelector({ cardSize, setCardSize }) {
  return (
    <div className="row w-100 justify-content-center mb-4 mt-3">
      <div className="col-12 col-md-6 col-lg-4">
        <fieldset className="btn-group w-100" aria-label="Card Size Selector">
          <legend className="visually-hidden">Select card size</legend>
          <button
            type="button"
            className={`btn btn-outline-primary ${cardSize === "small" ? "active" : ""}`}
            onClick={() => setCardSize("small")}
            aria-pressed={cardSize === "small"}
            aria-label="Set card size to small"
          >
            Small
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${cardSize === "medium" ? "active" : ""}`}
            onClick={() => setCardSize("medium")}
            aria-pressed={cardSize === "medium"}
            aria-label="Set card size to medium"
          >
            Medium
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${cardSize === "large" ? "active" : ""}`}
            onClick={() => setCardSize("large")}
            aria-pressed={cardSize === "large"}
            aria-label="Set card size to large"
          >
            Large
          </button>
        </fieldset>
      </div>
    </div>
  );
}
