import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomCarousel from "../components/Carousel.jsx";

return (
	<main>
		<CustomCarousel />
		<div className="container mt-5">
			<h1 className="text-center mb-4">Welcome to Biblioforum!</h1>
			<p className="lead text-center">
				A digital platform that connects readers with libraries across the city.
			</p>
			<hr className="my-4" />
			<div className="row mt-5">
				<div className="col-md-4 text-center">
					<i className="fas fa-book fa-3x mb-3"></i>
					<h4>Browse Collections</h4>
					<p>
						Explore book catalogs from multiple libraries, all in one place.
					</p>
				</div>
				<div className="col-md-4 text-center">
					<i className="fas fa-user-plus fa-3x mb-3"></i>
					<h4>Register & Connect</h4>
					<p>
						Create your account to start reserving, borrowing, and reviewing
						books.
					</p>
				</div>
				<div className="col-md-4 text-center">
					<i className="fas fa-calendar-check fa-3x mb-3"></i>
					<h4>Reserve & Borrow</h4>
					<p>
						Easily reserve your favorite titles and manage your book loans
						online.
					</p>
				</div>
			</div>
		</div>
	</main>
);
