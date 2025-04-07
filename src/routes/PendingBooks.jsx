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
	const [showModal, setShowModal] = useState(false);
	const [currentReserve, setCurrentReserve] = useState(null);
	const [daysLoaned, setDaysLoaned] = useState(0);
	const [showReturnModal, setShowReturnModal] = useState(false);
	const [currentLoan, setCurrentLoan] = useState(null);

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
		try {
			const data = await fetchData(`/getAllLoans`, "GET", null, token);
			setLoans(data);
		} catch (err) {
			setMessage(err.message);
		}
	};

	const openLoanModal = (reserve) => {
		setCurrentReserve(reserve);
		setShowModal(true);
	};

	const closeLoanModal = () => {
		setShowModal(false);
		setCurrentReserve(null);
		setDaysLoaned(0);
	};

	const confirmLoan = async () => {
		if (!currentReserve) return;

		try {
			const loanRequest = {
				Username: currentReserve.userName,
				BookTitle: currentReserve.bookTitle,
				daysLoaned,
			};
			const response = await fetchData(
				`/loanReserved`,
				"POST",
				loanRequest,
				token
			);
			if (response.success) {
				setMessage("Loan successful"); // TODO: Cambiar a una notificación
				fetchReserves();
				fetchLoans();
			} else {
				setMessage(response.message || "Loan failed");
			}
		} catch (err) {
			setMessage(err.message);
		} finally {
			closeLoanModal();
		}
	};

	const openReturnModal = (loan) => {
		setCurrentLoan(loan);
		setShowReturnModal(true);
	};

	const closeReturnModal = () => {
		setShowReturnModal(false);
		setCurrentLoan(null);
	};

	const confirmReturn = async () => {
		if (!currentLoan) return;

		try {
			const returnRequest = {
				loanId: currentLoan.loanId,
			};
			const response = await fetchData(`/return`, "PUT", returnRequest, token);
			if (response.success) {
				setMessage("Return successful");
				fetchLoans();
			} else {
				setMessage(response.message || "Return failed");
			}
		} catch (err) {
			setMessage(err.message);
		} finally {
			closeReturnModal();
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

									<div className="flex-grow-1">
										<p className="mb-1">
											<strong>Reserved by:</strong> {reserve.userName}
										</p>
										<p className="mb-1">
											<strong>Title:</strong> {reserve.bookTitle}
										</p>
										<p className="mb-2">
											<strong>Date:</strong>
											<span className="mx-1">
												{new Date(reserve.reservationDate).toLocaleDateString(
													"es-ES"
												)}
											</span>
											<small className="text-muted">
												({diffDays} days ago)
											</small>
										</p>

										<button
											className="btn btn-sm btn-success"
											onClick={() => openLoanModal(reserve)}
										>
											Loan
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				)}

				{selectedButton === "Loans" && (
					<ul className="list-group">
						{loans.map((loan) => {
							const imageSrc = loan.bookImage
								? `data:image/jpeg;base64,${loan.bookImage}`
								: null;

							const today = new Date();
							const returnDate = new Date(loan.returnDate);
							const remainingDays = Math.floor(
								(returnDate - today) / (1000 * 60 * 60 * 24)
							);

							return (
								<li
									key={loan.startDate}
									className="list-group-item d-flex align-items-center p-3 text-start"
									style={{ width: "400px", minHeight: "100px" }}
								>
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
												alt={loan.book}
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

									<div className="flex-grow-1">
										<p className="mb-1">
											<strong>Loaned by:</strong> {loan.userName}
										</p>
										<p className="mb-1">
											<strong>Title:</strong> {loan.book}
										</p>
										<p className="mb-2">
											<strong>Return Date:</strong>
											<span className="mx-1">
												{new Date(loan.returnDate).toLocaleDateString("es-ES")}
											</span>
											<small
												className={`text-muted ${
													remainingDays <= 0 ? "text-danger" : ""
												}`}
											>
												(
												{remainingDays > 0
													? `${remainingDays} days left`
													: "Overdue!"}
												)
											</small>
										</p>
										<button
											className="btn btn-sm btn-danger"
											onClick={() => openReturnModal(loan)}
										>
											Return
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>

			{/* Modal for loan confirmation */}
			{showModal && currentReserve && (
				<div className="modal d-block" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									Loan {currentReserve.bookTitle} to {currentReserve.userName}
								</h5>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label htmlFor="daysLoanedInput">Days loaned:</label>
									<input
										type="number"
										className="form-control"
										id="daysLoanedInput"
										value={daysLoaned}
										onChange={(e) => setDaysLoaned(e.target.value)}
										min="1"
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-primary"
									onClick={confirmLoan}
								>
									Confirm
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={closeLoanModal}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Modal for return confirmation */}
			{showReturnModal && currentLoan && (
				<div className="modal d-block" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									Confirm {currentLoan.userName} has returned {currentLoan.book}
									?
								</h5>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-primary"
									onClick={confirmReturn}
								>
									Confirm
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={closeReturnModal}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{message && <p className="text-danger">{message}</p>}
		</main>
	);
}
