import React, { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../utils/fetch";
import "../styles/Carousel.css";
import defaultBook from "../img/defaultBook.svg";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MAX_VISIBILITY = 3;

const fetchBooks = async (setBooks, genre = "") => {
  try {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);

    const data = await fetchData(
      `/public/books/random/${localStorage.getItem("libraryName")}?${params.toString()}`,
      "GET",
      null
    );

    if (data.success) {
      setBooks(data.message);
    } else {
      toast.error(data.message || "Error al obtener libros");
    }
  } catch (err) {
    toast.error(err.message || "Error al obtener libros");
  }
};

const Card = React.memo(({ title, image, preload }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(defaultBook); // Imagen por defecto (placeholder)
  const navigate = useNavigate();

  const navigateToBookDetails = () => {
    navigate(`/viewBook/${encodeURIComponent(title)}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageSrc(image); // Cambiar la imagen por la real cuando se haya cargado
  };

  useEffect(() => {
    if (preload) {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, Math.random() * (700 - 300) + 300);
      return () => clearTimeout(timeout);
    }
  }, [preload]);

  return (
    <div
      className="cardC"
      style={{ textAlign: "center", cursor: "pointer" }}
      onClick={navigateToBookDetails}
    >
      {isLoading ? (
        <div>
          <Skeleton width={200} height={20} className="my-3" />
          <Skeleton width={300} height={375} />
        </div>
      ) : (
        <>
          <h2>{title}</h2>
          <img
            src={imageSrc}
            alt={title}
            loading={preload ? "eager" : "lazy"}
            fetchpriority={preload ? "high" : "auto"}
            onLoad={handleImageLoad} 
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </>
      )}
    </div>
  );
});

const Carousel = ({ children }) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = React.Children.count(children);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        if (prev === count - 1) {
          setDirection(-1);
          return prev - 1;
        } else if (prev === 0) {
          setDirection(1);
          return prev + 1;
        } else {
          return prev + direction;
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [count, direction]);

  return (
    <div className="carousel" aria-label="Book Carousel">
      <button className="nav left" onClick={() => setActive((i) => (i - 1 + count) % count)}>
        <i className="fa-solid fa-arrow-left py-5"></i>
      </button>

      {React.Children.map(children, (child, i) => (
        <div
          className="cardC-container"
          style={{
            "--active": i === active ? 1 : 0,
            "--offset": (active - i) / 3,
            "--direction": Math.sign(active - i),
            "--abs-offset": Math.abs(active - i) / 3,
            pointerEvents: active === i ? "auto" : "none",
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? "0" : "1",
            display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
          }}
        >
          {child}
        </div>
      ))}

      <button className="nav right" onClick={() => setActive((i) => (i + 1) % count)}>
        <i className="fa-solid fa-arrow-right py-5"></i>
      </button>
    </div>
  );
};

const CustomCarousel = ({ genre = "", preloadFirst = false }) => {
  const [books, setBooks] = useState([]);
  const [library, setLibrary] = useState(localStorage.getItem("libraryName"));

  useEffect(() => {
    fetchBooks(setBooks, genre);
  }, [genre]);

  useEffect(() => {
    const currentLibrary = localStorage.getItem("libraryName");
    if (currentLibrary !== library) {
      setLibrary(currentLibrary);
      fetchBooks(setBooks, genre);
    }
  }, [library, genre]);

  return (
    <div className="carousel-wrapper my-3">
      <Suspense fallback={<Loading />}>
        <Carousel>
          {books.map((book, i) => (
            <Card
              key={i}
              title={book.title}
              image={
                book.image
                  ? `data:image/jpeg;base64,${book.image}`
                  : defaultBook
              }
              preload={preloadFirst && i === 0}
            />
          ))}
        </Carousel>
      </Suspense>
    </div>
  );
}

export default CustomCarousel;
