import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../utils/fetch";
import "../styles/Carousel.css";
import defaultBook from "/img/defaultBook.svg";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Skeleton from "react-loading-skeleton";

const MAX_VISIBILITY = 3;

const fetchBooks = async (setBooks, genre = "", library) => {
  try {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);

    const data = await fetchData(
      `/public/books/random/${library}?${params.toString()}`,
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
  const [imageSrc, setImageSrc] = useState(defaultBook);
  const navigate = useNavigate();

  const navigateToBookDetails = () => {
    const formattedTitle = title.trim().replaceAll(" ", "_");
    navigate(`/viewBook/${encodeURIComponent(formattedTitle)}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageSrc(image);
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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigateToBookDetails();
      }}
      aria-label={`Ver detalles del libro ${title}`}
    >
      {isLoading ? (
        <div>
          <Skeleton width={200} height={20} className="my-3" />
          <Skeleton width={300} height={375} />
        </div>
      ) : (
        <>
          <h2 title={title}>
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </h2>
          <img
            src={imageSrc}
            alt={`Portada del libro ${title}`}
            loading={preload ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            width={220}
            height={220}
            style={{ maxWidth: "100%", height: "auto" }}
            className="shadow"
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
    <div
      className="carousel"
      role="region"
      aria-label="Carrusel de libros"
      tabIndex={-1}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-9999px",
          height: 0,
          overflow: "hidden",
        }}
      >
        {`Libro activo: ${
          React.Children.toArray(children)[active]?.props.title || ""
        }`}
      </div>

      <button
        className="nav left"
        onClick={() => setActive((i) => (i - 1 + count) % count)}
        aria-label="Anterior libro"
        type="button"
      >
        <i className="fa-solid fa-arrow-left py-5"></i>
      </button>

      {React.Children.map(children, (child, i) => (
        <div
          className="cardC-container"
          aria-hidden={active !== i}
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

      <button
        className="nav right"
        onClick={() => setActive((i) => (i + 1) % count)}
        aria-label="Siguiente libro"
        type="button"
      >
        <i className="fa-solid fa-arrow-right py-5"></i>
      </button>
    </div>
  );
};

const CustomCarousel = ({ genre = "", preloadFirst = false }) => {
  const [books, setBooks] = useState([]);
  const [library, setLibrary] = useState(localStorage.getItem("libraryName"));

  useEffect(() => {
    fetchBooks(setBooks, genre, library);
  }, [genre, library]);

  useEffect(() => {
    const handleLibraryChange = () => {
      const currentLibrary = localStorage.getItem("libraryName");
      setLibrary(currentLibrary);
      fetchBooks(setBooks, genre, currentLibrary);
    };

    window.addEventListener("libraryChanged", handleLibraryChange);
    return () => {
      window.removeEventListener("libraryChanged", handleLibraryChange);
    };
  }, [genre]);

  if (!books.length) {
    return <Loading />;
  }

  return (
    <div className="carousel-wrapper my-3">
      <Carousel>
        {books.map((book, i) => (
          <Card
            key={i}
            title={book.title}
            image={
              book.image ? `data:image/jpeg;base64,${book.image}` : defaultBook
            }
            preload={preloadFirst && i === 0}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
