import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../utils/fetch";
import "../styles/Carousel.css";
import defaultBook from "../img/defaultBook.svg";
import { useNavigate } from "react-router-dom";

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
            toast.error(data.message || "An error occurred while fetching books");
        }
    } catch (err) {
        toast.error(err.message || "An error occurred while fetching books");
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
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => navigateToBookDetails(title)}
            aria-label={`Book Card: ${title}`}
        >
            <h2 aria-label="Book Title">{title}</h2>
            <img src={image || defaultBook} alt={title} aria-label="Book Image" />
        </div>
    );
};

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
            <button
                className="nav left"
                onClick={() => setActive((i) => (i - 1 + count) % count)}
                aria-label="Previous Book Button"
            >
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
                    aria-label={`Carousel Item ${i + 1}`}
                >
                    {child}
                </div>
            ))}

            <button
                className="nav right"
                onClick={() => setActive((i) => (i + 1) % count)}
                aria-label="Next Book Button"
            >
                <i className="fa-solid fa-arrow-right py-5"></i>
            </button>
        </div>
    );
};

const CustomCarousel = ({ genre = ""}) => {
    const [books, setBooks] = useState([]);
    const [library, setLibrary] = useState(localStorage.getItem("libraryName"));

    useEffect(() => {
        fetchBooks(setBooks, genre);
    }, [genre]);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentLibrary = localStorage.getItem("libraryName");
            if (currentLibrary !== library) {
                setLibrary(currentLibrary);
                fetchBooks(setBooks, genre);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [library, genre]);

    return (
        <div className="carousel-wrapper my-3" aria-label="Custom Book Carousel">
            <Carousel>
                {books.map((book, i) => (
                    <Card
                        key={i}
                        title={book.title}
                        image={
                            book.image ? `data:image/jpeg;base64,${book.image}` : defaultBook
                        }
                    />
                ))}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;
