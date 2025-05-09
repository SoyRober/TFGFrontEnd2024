import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomCarousel from "../components/Carousel.jsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../utils/fetch.js";

export default function Presentation() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchData("/public/genres", "GET", null);

        if (data.success) {
          setGenres(
            data.message
              .map((genre) => ({ id: genre.id, name: genre.name }))
              .sort(() => Math.random() - 0.5)
          );
        } else {
          toast.error(
            data.message || "An error occurred while fetching genres"
          );
        }
      } catch (err) {
        toast.error(err.message || "An error occurred while fetching genres");
      }
    };

    fetchGenres();
  }, []);

  return (
    <main>
      <CustomCarousel aria-label="Image carousel showcasing random books" />
      <div className="container mt-5">
        <h1 className="text-center mb-4 display-4" aria-label="Welcome message">
          Welcome to BiblioForum!
        </h1>
        <p
          className="lead text-center text-muted"
          aria-label="Platform description"
        >
          A digital platform that connects readers with libraries across the city.
        </p>
        <hr className="my-4" aria-hidden="true" />
        <div className="row mt-5">
          <div className="col-md-4 text-center">
            <i
              className="fas fa-book fa-3x mb-3 text-primary"
              aria-hidden="true"
            ></i>
            <h4 className="fw-bold" aria-label="Browse Collections section">
              Browse Collections
            </h4>
            <p className="text-muted" aria-label="Description of Browse Collections">
              Explore book catalogs from multiple libraries, all in one place.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <i
              className="fas fa-user-plus fa-3x mb-3 text-success"
              aria-hidden="true"
            ></i>
            <h4 className="fw-bold" aria-label="Register and Connect section">
              Register & Connect
            </h4>
            <p className="text-muted" aria-label="Description of Register and Connect">
              Create your account to start reserving, borrowing, and reviewing books.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <i
              className="fas fa-calendar-check fa-3x mb-3 text-warning"
              aria-hidden="true"
            ></i>
            <h4 className="fw-bold" aria-label="Reserve and Borrow section">
              Reserve & Borrow
            </h4>
            <p className="text-muted" aria-label="Description of Reserve and Borrow">
              Easily reserve your favorite titles and manage your book loans online.
            </p>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold">Featured Genres</h2>
        {genres.slice(0, 3).map((genre) => (
          <div key={genre.id} className="mb-5">
            <h3 className="text-center text-primary">{genre.name}</h3>
            <CustomCarousel aria-label={`Carousel for ${genre.name}`} />
          </div>
        ))}
      </div>
    </main>
  );
}
