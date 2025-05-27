export default function BookCard({ book, cardSize, defaultBook, onClick }) {
  const { title, image } = book;

  const getColumnClass = () => {
    switch (cardSize) {
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

  const imageUrl = image ? `data:image/jpeg;base64,${image}` : defaultBook;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const heightMap = {
    small: "250px",
    medium: "350px",
    large: "600px",
  };

  const widthMap = {
    small: 120,
    medium: 180,
    large: 300,
  };

  const heightImgMap = {
    small: 180,
    medium: 250,
    large: 400,
  };

  const fontSizeMap = {
    small: "1.5em",
    medium: "2em",
    large: "2.5em",
  };

  const marginTopMap = {
    small: "mt-3",
    medium: "mt-4",
    large: "mt-5",
  };

  return (
    <article
      className={getColumnClass()}
      aria-label={`Book card for ${title}`}
      aria-describedby={`title-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div
        role="button"
        tabIndex={0}
        className="customized-card pt-1 shadow-sm"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        style={{
          height: heightMap[cardSize] || "250px",
          minHeight: heightMap[cardSize] || "250px",
          cursor: "pointer",
        }}
      >
        <figure
          className="d-flex justify-content-center align-items-center pb-2"
          style={{
            height: "60%",
            width: "100%",
            overflow: "hidden",
          }}
          aria-label={`Image of ${title}`}
        >
          <img
            src={imageUrl}
            width={widthMap[cardSize]}
            height={heightImgMap[cardSize]}
            className="shadow"
            style={{
              objectFit: "contain",
              display: "block",
              borderRadius: "4px",
            }}
            loading="eager"
            decoding="async"
          />
        </figure>
        <div className="d-flex justify-content-center">
          <hr
            className="my-1"
            style={{ borderTop: "1px solid black", width: "80%" }}
          />
        </div>
        <div className="card-body">
          <h2
            id={`title-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className={`text-center ${marginTopMap[cardSize] || "mt-3"}`}
            style={{
              fontWeight: "500",
              fontSize: fontSizeMap[cardSize] || "1.5em",
            }}
          >
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </h2>
        </div>
      </div>
    </article>
  );
}
