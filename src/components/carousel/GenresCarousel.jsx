import React, { useState, useEffect, Suspense } from "react";
import Loading from "../Loading";
import { fetchData } from "../../utils/fetch";

const CustomCarousel = React.lazy(() => import("./CustomCarousel"));

export default function GenresCarousel({ genres }) {
  const [genresToShow, setGenresToShow] = useState([]);
  const library = localStorage.getItem("libraryName");

  async function hasBooks(genreName, library) {
    try {
      const params = new URLSearchParams();
      if (genreName) params.append("genre", genreName);

      const data = await fetchData(
        `/public/books/random/${library}?${params.toString()}`,
        "GET",
        null
      );

      return data.success && data.message.length > 0;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function filterGenres() {
      const filtered = [];
      for (let i = 0; i < genres.length && filtered.length < 3; i++) {
        const genre = genres[i];
        const exists = await hasBooks(genre.name, library);
        if (exists) filtered.push(genre);
      }
      if (isMounted) setGenresToShow(filtered);
    }

    filterGenres();

    return () => {
      isMounted = false;
    };
  }, [genres, library]);

  if (genresToShow.length === 0) return <Loading />;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Featured Genres</h2>
      {genresToShow.map((genre) => (
        <section
          key={genre.id}
          className="mb-5"
          aria-label={`Género: ${genre.name}`}
        >
          <h3 className="text-primary">{genre.name}</h3>
          <Suspense fallback={<Loading />}>
            <CustomCarousel genre={genre.name} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
