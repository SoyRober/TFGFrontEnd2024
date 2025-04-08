import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchData } from '../utils/fetch';
import '../styles/Carousel.css';
import defaultBook from '../img/defaultBook.svg'; // Importa la imagen por defecto
import { useNavigate } from 'react-router-dom';

const MAX_VISIBILITY = 3;

const fetchBooks = async (setBooks) => {
  try {
    const data = await fetchData('/books/random', 'GET', null);
    if (data.success) {
      setBooks(data.message); // Guarda los libros en el estado
    } else {
      toast.error(data.message || 'An error occurred while fetching books');
    }
  } catch (err) {
    toast.error(err.message || 'An error occurred while fetching books');
  }
};

const Card = ({ title, image }) => {
  const navigate = useNavigate();

  const navigateToBookDetails = (title) => {
    navigate(`/viewBook/${encodeURIComponent(title)}`);
  };

  return (
    <div
      className="cardC"
      style={{ textAlign: 'center', cursor: 'pointer' }}
      onClick={() => navigateToBookDetails(title)}
    >
      <h2>{title}</h2>
      <img
        src={image || defaultBook} // Imagen por defecto si no hay imagen
        alt={title}
      />
    </div>
  );
};

const Carousel = ({ children }) => {
  const [active, setActive] = useState(2);
  const count = React.Children.count(children);

  return (
    <div className="carousel">
      {active > 0 && (
        <button className="nav left" onClick={() => setActive((i) => i - 1)}>
          <i className="fa-solid fa-arrow-left py-5"></i>
        </button>
      )}
      {React.Children.map(children, (child, i) => (
        <div
          className="cardC-container"
          style={{
            '--active': i === active ? 1 : 0,
            '--offset': (active - i) / 3,
            '--direction': Math.sign(active - i),
            '--abs-offset': Math.abs(active - i) / 3,
            'pointer-events': active === i ? 'auto' : 'none',
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
            display: Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
          }}
        >
          {child}
        </div>
      ))}
      {active < count - 1 && (
        <button className="nav right" onClick={() => setActive((i) => i + 1)}>
          <i className="fa-solid fa-arrow-right py-5"></i>
        </button>
      )}
    </div>
  );
};

const CustomCarousel = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks(setBooks); // Llama a fetchBooks al montar el componente
  }, []);

  return (
    <div className="carousel-wrapper my-3">
      <Carousel>
        {books.map((book, i) => (
          <Card
            key={i}
            title={book.title} // Título del libro
            image={book.image ? `data:image/jpeg;base64,${book.image}` : defaultBook} // Imagen del libro
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;