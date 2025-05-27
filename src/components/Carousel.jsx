import React, { useEffect, useState, useRef } from "react";
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

const Card = React.memo(function Card({ title, image, preload }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const navigateToBookDetails = () => {
    const formattedTitle = title.trim().replaceAll(" ", "_");
    navigate(`/viewBook/${encodeURIComponent(formattedTitle)}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

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
      aria-label={`See book details of ${title}`}
    >
      {isLoading && (
        <div>
          <Skeleton width={200} height={20} className="my-3" />
          <Skeleton width={300} height={375} />
        </div>
      )}
      <h2 title={title} style={{ display: isLoading ? "none" : "block" }}>
        {title.length > 30 ? title.slice(0, 30) + "..." : title}
      </h2>
      <img
        src={image || defaultBook}
        alt={`Book front page of ${title}`}
        loading={preload ? "eager" : "lazy"}
        onLoad={handleImageLoad}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "2 / 3",
          objectFit: "contain",
          maxWidth: "220px",
          display: isLoading ? "none" : "block",
          margin: "0 auto",
        }}
        className="shadow"
      />
    </div>
  );
});


const Carousel = ({ children }) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const count = React.Children.count(children);
  const pauseTimeoutRef = useRef(null);

  const handlePause = () => {
    setIsPaused(true);
    clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  };

  const handlePrev = () => {
    if (active > 0) {
      setActive((i) => i - 1);
      handlePause();
    }
  };

  const handleNext = () => {
    if (active < count - 1) {
      setActive((i) => i + 1);
      handlePause();
    }
  };

  useEffect(() => {
    if (isPaused || count <= 1) return;

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
  }, [count, direction, isPaused]);

  useEffect(() => {
    return () => clearTimeout(pauseTimeoutRef.current);
  }, []);

  return (
    <div
      className="carousel"
      role="region"
      aria-label="Book carousel"
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
        {`Active book: ${
          React.Children.toArray(children)[active]?.props.title || ""
        }`}
      </div>

      {active > 0 && (
        <button
          className="nav left"
          onClick={handlePrev}
          aria-label="Past book"
          type="button"
        >
          <i className="fa-solid fa-arrow-left py-5"></i>
        </button>
      )}

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

      {active < count - 1 && (
        <button
          className="nav right"
          onClick={handleNext}
          aria-label="Next book"
          type="button"
        >
          <i className="fa-solid fa-arrow-right py-5"></i>
        </button>
      )}
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
