import { Suspense } from 'react';
import Loading from './Loading';
import CustomCarousel from './Carousel';

export default function GenresCarousel({ genres }) {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Featured Genres</h2>
      {genres.slice(0, 3).map((genre) => (
        <div key={genre.id} className="mb-5">
          <h3 className="text-primary">{genre.name}</h3>
          <Suspense fallback={<Loading />}>
            <CustomCarousel
              aria-label={`Carousel for ${genre.name}`}
              genre={genre.name}
            />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
