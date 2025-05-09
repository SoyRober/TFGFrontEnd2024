import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchData } from "../utils/fetch.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

const Loans = ({ cardSize = "medium" }) => {
	const [loans, setLoans] = useState([]);
	const [filters, setFilters] = useState({
		startDate: "",
		title: "",
		returned: "notReturned",
	});
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	const fetchLoans = useCallback(async () => {
		if (!token) {
			toast.error("Please log in to access this page");
			navigate("/login");
			return;
		}

		try {
			const formattedStartDate = filters.startDate
				? new Date(filters.startDate).toISOString().split("T")[0]
				: "";

			const data = await fetchData(
				`/user/loans/getUserLoans?page=${page}&size=10&title=${
					filters.title
				}&isReturned=${
					filters.returned !== "notReturned"
				}&startDate=${formattedStartDate}`,
				"GET",
				null,
				token
			);

			if (data.success) {
				if (page === 0 && data.message.length === 0) {
					toast.info("No loans found.");
				}

				setLoans((prevLoans) =>
					page === 0 ? data.message : [...prevLoans, ...data.message]
				);

				if (data.message.length < 10) {
					setHasMore(false);
				}
			} else {
				toast.error(data.message || "An error occurred while fetching loans");
			}
		} catch (err) {
			toast.error(err.message || "An error occurred while fetching loans");
		}
	}, [filters, page, token, navigate]);

	useEffect(() => {
		fetchLoans();
	}, [fetchLoans]);

	const resetFilters = () => {
		setFilters({ startDate: "", title: "", returned: "notReturned" });
		setPage(0);
		setHasMore(true);
	};

	const getColumnClass = (size) => {
		switch (size) {
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
			<section className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
				<div className="d-flex align-items-center">
					<label htmlFor="startDateFilter" className="me-2">
						Date:
					</label>
					<DatePicker
						selected={filters.startDate}
						onChange={(date) =>
							setFilters((prev) => ({ ...prev, startDate: date }))
						}
						className="form-control"
						dateFormat="dd/MM/yyyy"
						placeholderText="Select a start date"
						id="startDateFilter"
						aria-label="Filter loans by start date"
					/>
					<button
						className="btn btn-outline-secondary btn-sm ms-2"
						onClick={() => setFilters((prev) => ({ ...prev, startDate: "" }))}
						aria-label="Reset start date filter"
					>
						<i className="fa-solid fa-rotate-right"></i>
					</button>
				</div>

				<div className="d-flex align-items-center">
					<label htmlFor="titleFilter" className="me-2">
						Title:
					</label>
					<input
						type="text"
						id="titleFilter"
						className="form-control"
						placeholder="Name or surname"
						value={filters.title}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, title: e.target.value }))
						}
						aria-label="Filter loans by title"
					/>
					<button
						className="btn btn-outline-secondary btn-sm ms-2"
						onClick={() => setFilters((prev) => ({ ...prev, title: "" }))}
						aria-label="Reset title filter"
					>
						<i className="fa-solid fa-rotate-right"></i>
					</button>
				</div>

				<div className="d-flex align-items-center">
					<label htmlFor="returnedFilter" className="me-2">
						Status:
					</label>
					<select
						id="returnedFilter"
						className="form-select"
						value={filters.returned}
						onChange={(e) =>
							setFilters((prev) => ({ ...prev, returned: e.target.value }))
						}
						aria-label="Filter loans by return status"
					>
						<option value="returned">Returned</option>
						<option value="notReturned">Not Returned</option>
					</select>
					<button
						className="btn btn-outline-secondary ms-2"
						onClick={() =>
							setFilters((prev) => ({ ...prev, returned: "notReturned" }))
						}
						aria-label="Reset return status filter"
					>
						<i className="fa-solid fa-rotate-right"></i>
					</button>
				</div>

				<button
					className="btn btn-warning"
					onClick={resetFilters}
					aria-label="Reset all filters"
				>
					Reset Filters
				</button>
			</section>

			<section className="container mt-5">
				<InfiniteScroll
					dataLength={loans.length}
					next={() => setPage((prev) => prev + 1)}
					hasMore={loans.length % 30 === 0 && loans.length > 0}
					loader={<Loading />}
					endMessage={
						<p className="text-center mt-4 text-muted">
							There aren't more loans
						</p>
					}
					style={{ overflow: "hidden" }}
				>
					<div className="row">
						{loans.map((loan, index) => (
							<article
								key={index}
								className={`${getColumnClass(cardSize)} mb-4`}
								aria-label={`Loan card for the book ${loan.book}`}
							>
								<div className="card h-100 p-1">
									<img
										src={`data:image/jpeg;base64,${loan.bookImage}`}
										className="card-img-top"
										alt={`Cover of ${loan.book}`}
										aria-label={`Cover image of the book ${loan.book}`}
									/>
									<div className="d-flex justify-content-center">
										<hr
											className="my-1"
											style={{ borderTop: "1px solid black", width: "80%" }}
										/>
									</div>
									<div className="card-body text-center">
										<h5 className="card-title">
											<Link
												to={`/viewBook/${loan.book}`}
												className="text-decoration-none"
												aria-label={`View details for the book ${loan.book}`}
											>
												{loan.book}
											</Link>
										</h5>
										<p>
											<strong>Start Date:</strong>{" "}
											{new Date(loan.startDate).toLocaleDateString("es-ES")}
										</p>
										<p>
											<strong>Return Date:</strong>{" "}
											{loan.returnDate
												? new Date(loan.returnDate).toLocaleDateString("es-ES")
												: "N/A"}
										</p>
										<p>
											<strong>Returned:</strong> {loan.isReturned ? "Yes" : "No"}
										</p>
									</div>
								</div>
							</article>
						))}
					</div>
				</InfiniteScroll>
			</section>
		</main>
	);
};

export default Loans;
