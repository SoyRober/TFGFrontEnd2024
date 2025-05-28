import { Suspense, lazy } from 'react';
import Loading from './Loading';

const CustomCarousel = lazy(() => import('./Carousel'));

export default function GenresCarousel({ genres }) {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Featured Genres</h2>
      {genres.slice(0, 3).map((genre) => (
        <section key={genre.id} className="mb-5" aria-label={`Género: ${genre.name}`}>
          <h3 className="text-primary">{genre.name}</h3>
          <Suspense fallback={<Loading />}>
            <CustomCarousel genre={genre.name} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
