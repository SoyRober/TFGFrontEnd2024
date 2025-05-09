import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../components/Loading.jsx";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import defaultBook from "../img/defaultBook.svg";

const UserReservations = ({ cardSize }) => {
	const [reservations, setReservations] = useState([]);
	const [filteredReservations, setFilteredReservations] = useState([]);
	const [dateFilter, setDateFilter] = useState("");
	const [loanedFilter, setReturnedFilter] = useState("all");
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (!token) {
			toast.error("No token found");
			navigate("/login");
			return;
		}

		fetchReservations();
	}, [page]);

	useEffect(() => {
		localStorage.setItem("cardSize", cardSize);
	}, [cardSize]);

	useEffect(() => {
		let result = [...reservations];

		if (dateFilter) {
			const formattedDate = new Date(dateFilter).toLocaleDateString();
			result = result.filter(
				(r) =>
					new Date(r.reservationDate).toLocaleDateString() === formattedDate
			);
		}

		if (loanedFilter !== "all") {
			const isLoaned = loanedFilter === "returned";
			result = result.filter((r) => r.isLoaned === isLoaned);
		}

		setFilteredReservations(result);
	}, [dateFilter, loanedFilter, reservations]);

	const fetchReservations = async () => {
		if (isFetching) return;

		setIsFetching(true);
		try {
			const data = await fetchData(
				`/user/getUserReservations?page=${page}&size=10`,
				"GET",
				null,
				token
			);

			if (data.length === 0) {
				setHasMore(false);
			} else {
				setReservations((prev) => [
					...prev,
					...data.filter(
						(newR) => !prev.some((r) => r.reservationId === newR.reservationId)
					),
				]);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsFetching(false);
		}
	};

	const cancelReservation = async (title) => {
		try {
			await fetchData(
				`/user/cancelReservation?title=${encodeURIComponent(title)}`,
				"POST",
				null,
				token
			);
			setReservations((prev) => prev.filter((r) => r.bookTitle !== title));
		} catch (error) {
			toast.error(error.message);
		}
	};

	const getColumnClass = (cardSize) => {
		switch (cardSize) {
			case "small":
				return "col-12 col-sm-6 col-md-4 col-lg-3";
			case "medium":
				return "col-12 col-sm-6 col-md-6 col-lg-4";
			case "large":
				return "col-12 col-md-6";
			default:
				return "col-12";
		}
	};

	return (
		<main className="container mt-5">
			<div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
				<div className="d-flex align-items-center">
					<label htmlFor="startDateFilter" className="me-2">
						Date:
					</label>
					<DatePicker
						selected={dateFilter}
						onChange={(date) => setDateFilter(date)}
						className="form-control"
						dateFormat="dd/MM/yyyy"
						placeholderText="Select a date"
						id="startDateFilter"
						aria-label="Filter reservations by date"
					/>
					<button
						className="btn btn-outline-secondary btn-sm ms-2"
						onClick={() => setDateFilter("")}
						aria-label="Reset date filter"
					>
						⟲
					</button>
				</div>

				<div className="d-flex align-items-center">
					<label htmlFor="loanedFilter" className="me-2">
						Status:
					</label>
					<select
						id="loanedFilter"
						className="form-select"
						value={loanedFilter}
						onChange={(e) => setReturnedFilter(e.target.value)}
						aria-label="Filter reservations by loan status"
					>
						<option value="all">All</option>
						<option value="returned">Loaned</option>
						<option value="notReturned">Not loaned</option>
					</select>
					<button
						className="btn btn-outline-secondary ms-2"
						onClick={() => setReturnedFilter("all")}
						aria-label="Reset loan status filter"
					>
						⟲
					</button>
				</div>

				<button
					className="btn btn-warning"
					onClick={() => {
						setDateFilter("");
						setReturnedFilter("all");
					}}
					aria-label="Reset all filters"
				>
					Reset Filters
				</button>
			</div>

			<div className="container mt-5">
				<InfiniteScroll
					dataLength={filteredReservations.length}
					next={() => setPage((prev) => prev + 1)}
					hasMore={
						!isFetching &&
						filteredReservations.length % 30 === 0 &&
						filteredReservations.length > 0
					}
					loader={<Loading />}
					endMessage={
						<p className="text-center mt-4 text-muted">
							There aren't more loans
						</p>
					}
					style={{ overflow: "hidden" }}
				>
					<div className="row">
						{filteredReservations.map((reservation, index) => (
							<div key={index} className={`${getColumnClass(cardSize)} mb-4`}>
								<div
									className="card"
									style={{
										height:
											cardSize === "small"
												? "250px"
												: cardSize === "medium"
												? "350px"
												: "600px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
									}}
								>
									<div
										className="card-img-container"
										style={{
											flex: "1 0 40%",
											overflow: "hidden",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											padding: "4%",
										}}
									>
										<img
											src={
												reservation.image
													? `data:image/jpeg;base64,${reservation.image}`
													: defaultBook
											}
											className="img-fluid"
											alt={`Cover of ${reservation.bookTitle}`}
											aria-label={`Cover image of the book ${reservation.bookTitle}`}
											style={{
												maxWidth: "100%",
												maxHeight: "100%",
												objectFit: "cover",
											}}
										/>
									</div>
									<div
										className="card-body"
										style={{ flex: "1 0 40%", overflowY: "auto" }}
									>
										<h5 className="card-title" tabIndex="-1">
											<Link
												to={`/viewBook/${reservation.bookTitle}`}
												className="text-decoration-none d-flex align-items-center"
												aria-label={`View details for the book ${reservation.bookTitle}`}
											>
												{reservation.bookTitle}
												<i className="fas fa-mouse-pointer ms-2"></i>
											</Link>
										</h5>
										<p className="card-text">
											<strong>Reservation Date:</strong>{" "}
											{new Date(reservation.reservationDate).toLocaleDateString(
												"es-ES",
												{
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												}
											)}
										</p>
										<p className="card-text">
											<strong>Status:</strong> {reservation.status}
										</p>
										{reservation.status === "PENDING" && (
											<button
												className="btn btn-primary ms-2"
												onClick={() => cancelReservation(reservation.bookTitle)}
												aria-label={`Cancel reservation for the book ${reservation.bookTitle}`}
											>
												Cancel Reservation
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</InfiniteScroll>
			</div>
		</main>
	);
};

export default UserReservations;
