import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomCarousel from "../components/Carousel.jsx";

export default function Presentation() {
	return (
		<main>
			<CustomCarousel aria-label="Image carousel showcasing library features" />
			<div className="container mt-5">
				<h1 className="text-center mb-4" aria-label="Welcome message">
					Welcome to BiblioForum!
				</h1>
				<p className="lead text-center" aria-label="Platform description">
					A digital platform that connects readers with libraries across the city.
				</p>
				<hr className="my-4" aria-hidden="true" />
				<div className="row mt-5">
					<div className="col-md-4 text-center">
						<i
							className="fas fa-book fa-3x mb-3"
							aria-hidden="true"
						></i>
						<h4 aria-label="Browse Collections section">Browse Collections</h4>
						<p aria-label="Description of Browse Collections">
							Explore book catalogs from multiple libraries, all in one place.
						</p>
					</div>
					<div className="col-md-4 text-center">
						<i
							className="fas fa-user-plus fa-3x mb-3"
							aria-hidden="true"
						></i>
						<h4 aria-label="Register and Connect section">Register & Connect</h4>
						<p aria-label="Description of Register and Connect">
							Create your account to start reserving, borrowing, and reviewing books.
						</p>
					</div>
					<div className="col-md-4 text-center">
						<i
							className="fas fa-calendar-check fa-3x mb-3"
							aria-hidden="true"
						></i>
						<h4 aria-label="Reserve and Borrow section">Reserve & Borrow</h4>
						<p aria-label="Description of Reserve and Borrow">
							Easily reserve your favorite titles and manage your book loans online.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}