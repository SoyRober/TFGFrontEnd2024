import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { jwtDecode } from "jwt-decode";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchData } from "../utils/fetch";

export default function Attributes() {
	const [selectedButton, setSelectedButton] = useState("Reserves");
	const [hasPermissions, setHasPermissions] = useState(false);
	const navigate = useNavigate();
	const [reserves, setReserves] = useState([]);
	const [loans, setLoans] = useState([]);
	const [message, setMessage] = useState("");
	const [token] = useState(() => {
		return localStorage.getItem("token") ? localStorage.getItem("token") : null;
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const decodedToken = jwtDecode(token);
			const userRole = decodedToken.role;

			if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
				setHasPermissions(true);
				fetchReserves();
				fetchLoans();
			} else {
				navigate("/");
			}
		} else {
			navigate("/");
		}
	}, [navigate]);

	const fetchReserves = async () => {
		try {
			const data = await fetchData(`/getAllReservations`, "GET", null, token);
			setReserves(data);
		} catch (err) {
			setMessage(err.message);
		}
	};

	const fetchLoans = async () => {
		/*
		try {
			const data = await fetchData(`/getAllLoans`, "GET", null, token);
			setLoans(data);
		} catch (err) {
			setMessage(err.message);
		}
	*/
	};

	const handleLoan = async (reserve) => {
		try {
			const loanRequest = {
				Username: reserve.userName,
				BookTitle: reserve.bookTitle,
			};
			const response = await fetchData(`/loanReserved`, "POST", loanRequest, token);
			if (response.success) {
				setMessage("Loan successful");
				// Optionally refresh reserves after successful loan
				fetchReserves();
			} else {
				setMessage(response.message || "Loan failed");
			}
		} catch (err) {
			setMessage(err.message);
		}
	};

	if (!hasPermissions) {
		return <h1>UnAuthorized</h1>;
	}

	return (
		<main className="container text-center mt-5">
			<header className="mb-4">
				<h1>Reservations and Loans</h1>
			</header>

			<section className="btn-group mb-3" role="group">
				<button
					type="button"
					className={`btn ${
						selectedButton === "Reserves"
							? "btn-primary"
							: "btn-outline-primary"
					}`}
					onClick={() => setSelectedButton("Reserves")}
				>
					Reserves
				</button>

				<button
					type="button"
					className={`btn ${
						selectedButton === "Loans" ? "btn-primary" : "btn-outline-primary"
					}`}
					onClick={() => setSelectedButton("Loans")}
				>
					Loans
				</button>
			</section>

			<section>
				{selectedButton === "Reserves" && (
					<ul className="list-group">
						{reserves.map((reserve) => {
							const imageSrc = reserve.image
								? `data:image/jpeg;base64,${reserve.image}`
								: null;

							// Calcular la diferencia de días
							const reservationDate = new Date(reserve.reservationDate);
							const today = new Date();
							const diffTime = Math.abs(today - reservationDate);
							const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

							return (
								<li
									key={reserve.reservationDate}
									className="list-group-item d-flex align-items-center p-3 text-start"
									style={{ width: "400px", minHeight: "100px" }}
								>
									{/* Contenedor de imagen/icono con tamaño fijo */}
									<div
										className="me-3 d-flex align-items-center justify-content-center rounded"
										style={{
											width: "80px",
											height: "100px",
											backgroundColor: "#f8f9fa",
										}}
									>
										{imageSrc ? (
											<img
												src={imageSrc}
												alt={reserve.bookTitle}
												className="rounded"
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
										) : (
											<i
												className="bi bi-book text-secondary"
												style={{ fontSize: "2.5rem" }}
											></i>
										)}
									</div>

									{/* Información de la reserva */}
									<div className="flex-grow-1">
										<p className="mb-1">
											<strong>Reserved by:</strong> {reserve.userName}
										</p>
										<p className="mb-1">
											<strong>Title:</strong> {reserve.bookTitle}
										</p>
										<p className="mb-2">
											<strong>Date:</strong>
											<span className="mx-1">{reserve.reservationDate}</span>
											<small className="text-muted">
												({diffDays} days ago)
											</small>
										</p>
										
										<button
											className="btn btn-sm btn-success"
											onClick={() => handleLoan(reserve)}
										>
											Loan
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				)}

				{/*TODO selectedButton === "Loans" && (
					<ul>
						{loans.map((loan) => (
							<li key={loan.id}>{loan.name}</li> // Ajusta según tu estructura de datos
						))}
					</ul>
				)*/}
			</section>

			{message && <p className="text-danger">{message}</p>}
		</main>
	);
}
