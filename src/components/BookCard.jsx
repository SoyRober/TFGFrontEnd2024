export default function BookCard({
  book,
  cardSize,
  defaultBook,
  onClick,
}) {
  const getColumnClass = () => {
    switch (cardSize) {
      case 'small':
        return 'col-12 col-sm-6 col-md-4 col-lg-3';
      case 'medium':
        return 'col-12 col-sm-6 col-md-6 col-lg-4';
      case 'large':
        return 'col-12 col-md-6';
      default:
        return 'col-12';
    }
  };

  const imageUrl = book.image
    ? `data:image/jpeg;base64,${book.image}`
    : defaultBook;

  return (
    <article
      className={getColumnClass()}
      aria-label={`Book card for ${book.title}`}
    >
      <div
        className="customized-card pt-1 shadow-sm"
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        style={{
          height: cardSize === 'small' ? '250px' : cardSize === 'medium' ? '350px' : '600px',
        }}
      >
        <figure
          className="d-flex justify-content-center align-items-center pb-2"
          style={{
            height: '60%',
            width: '100%',
            overflow: 'hidden',
          }}
          aria-label={`Image of ${book.title}`}
        >
          <img
            src={imageUrl}
            alt={book.title}
            className="img-fluid w-50"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
        <div className="d-flex justify-content-center">
          <hr className="my-1" style={{ borderTop: '1px solid black', width: '80%' }} />
        </div>
        <div className="card-body">
          <h2
            className={`text-center ${
              cardSize === 'small'
                ? 'mt-3'
                : cardSize === 'medium'
                ? 'mt-4'
                : 'mt-5'
            }`}
            style={{
              fontWeight: '500',
              fontSize:
                cardSize === 'small'
                  ? '1.5em'
                  : cardSize === 'medium'
                  ? '2em'
                  : '2.5em',
            }}
          >
            {book.title}
          </h2>
        </div>
      </div>
    </article>
  );
}
