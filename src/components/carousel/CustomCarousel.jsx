import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../../utils/fetch";
import defaultBook from "/img/defaultBook.svg";
import Loading from "../Loading";
import Card from "./CarouselCard";
import Carousel from "./CarouselCore";

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
      if (data.message.length > 0) {
        setBooks(data.message);
      } else {
        setBooks([]);
      }
    } else {
      toast.error(data.message || "Error al obtener libros");
      setBooks([]);
    }
  } catch (err) {
    toast.error(err.message || "Error al obtener libros");
    setBooks([]);
  }
};

export default function CustomCarousel({ genre = "", preloadFirst = false }) {
  const [books, setBooks] = useState([]);
  const [library, setLibrary] = useState(localStorage.getItem("libraryName"));

  useEffect(() => {
    const fetchAndSetBooks = () => {
      const currentLibrary = localStorage.getItem("libraryName");
      setLibrary(currentLibrary);
      fetchBooks(setBooks, genre, currentLibrary);
    };

    fetchAndSetBooks();

    window.addEventListener("libraryChanged", fetchAndSetBooks);
    return () => window.removeEventListener("libraryChanged", fetchAndSetBooks);
  }, [genre]);

  if (!books.length) return <Loading />;

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
}
