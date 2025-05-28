import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../utils/fetch";
import Loading from "../components/Loading";
import GenresCarousel from "../components/GenresCarousel";

const CustomCarousel = lazy(() => import("../components/carousel/CustomCarousel"));

export default function Presentation() {
	const [genres, setGenres] = useState([]);
	const [showSections, setShowSections] = useState({
		carousel: false,
		features: false,
		genres: false,
	});

	const carouselRef = useRef(null);
	const featuresRef = useRef(null);
	const genresRef = useRef(null);

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

		if (!genres.length) {
			fetchGenres();
		}
	}, [genres]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const target = entry.target;

						if (target === carouselRef.current) {
							setShowSections((prev) => ({ ...prev, carousel: true }));
						} else if (target === featuresRef.current) {
							setShowSections((prev) => ({ ...prev, features: true }));
						} else if (target === genresRef.current) {
							setShowSections((prev) => ({ ...prev, genres: true }));
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (carouselRef.current) observer.observe(carouselRef.current);
		if (featuresRef.current) observer.observe(featuresRef.current);
		if (genresRef.current) observer.observe(genresRef.current);

		return () => {
			if (carouselRef.current) observer.unobserve(carouselRef.current);
			if (featuresRef.current) observer.unobserve(featuresRef.current);
			if (genresRef.current) observer.unobserve(genresRef.current);
		};
	}, []);

	return (
		<main>
			<div className="container mt-5">
				<h1 className="text-center mb-4 display-4">Welcome to BiblioForum!</h1>
				<p className="lead text-center text-muted">
					A digital platform that connects readers with libraries across the
					city.
				</p>
				<hr className="my-4" aria-hidden="true" />

				<div ref={carouselRef} role="region" aria-labelledby="carousel-heading">
					<h2 id="carousel-heading" className="visually-hidden">
						Book carousel
					</h2>
					{showSections.carousel && (
						<Suspense fallback={<Loading />}>
							<CustomCarousel aria-label="Image carousel showcasing random books" />
						</Suspense>
					)}
				</div>

				<div ref={featuresRef} role="region" aria-labelledby="features-heading">
					<h2 id="features-heading" className="visually-hidden">
						Features of BiblioForum
					</h2>
					{showSections.features && (
						<div className="row mt-5">
							<div className="col-md-4 text-center">
								<i
									className="fas fa-book fa-3x mb-3 text-primary"
								></i>
								<h3 className="fw-bold">Browse Collections</h3>
								<p className="text-muted">
									Explore book catalogs from multiple libraries, all in one
									place.
								</p>
							</div>
							<div className="col-md-4 text-center">
								<i
									className="fas fa-user-plus fa-3x mb-3 text-success"
								></i>
								<h3 className="fw-bold">Register & Connect</h3>
								<p className="text-muted">
									Create your account to start reserving, loaning, and reviewing
									books.
								</p>
							</div>
							<div className="col-md-4 text-center">
								<i
									className="fas fa-calendar-check fa-3x mb-3 text-warning"
								></i>
								<h3 className="fw-bold">Reserve & Loan</h3>
								<p className="text-muted">
									Easily reserve your favorite titles and manage your book loans
									online.
								</p>
							</div>
						</div>
					)}
				</div>

				<div ref={genresRef} role="region" aria-labelledby="genres-heading">
					<h2 id="genres-heading" className="visually-hidden">
						Book genres carousel
					</h2>
					{showSections.genres && <GenresCarousel genres={genres} />}
				</div>
			</div>
		</main>
	);
}
