import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch.js";
import { jwtDecode } from "jwt-decode";
import EditBookAttributeModal from "../components/modals/EditBookAttributeModal.jsx";
import BookLoansModal from "../components/modals/BookLoansModal.jsx";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import BookReservationModal from "../components/modals/BookReservationModal.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import defaultAvatar from "../img/defaultAvatar.svg";
import defaultBook from "../img/defaultBook.svg";
import LoanToUserModal from "../components/modals/LoanToUserModal.jsx";
import { compressImage } from "../utils/compressImage.js";
import { toast } from "react-toastify";

export default function ViewBook() {
	const { title } = useParams();
	const navigate = useNavigate();
	const [book, setBook] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [hasPermissions, setHasPermissions] = useState(false);
	const [editingAttribute, setEditingAttribute] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [imageSrc, setImageSrc] = useState("");
	const [reviewData, setReviewData] = useState({ score: "", comment: "" });
	const [hover, setHover] = useState(0);
	const [newImage, setNewImage] = useState(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [isLoaned, setLoanStatus] = useState();
	const [authors, setAuthors] = useState([]);
	const [selectedAuthors, setSelectedAuthors] = useState([]);
	const [genres, setGenres] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [alreadyRated, setAlreadyRated] = useState(false);
	const [currentUserScore, setCurrentUserScore] = useState("");
	const [currentUserComment, setCurrentUserComment] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [tempReviewData, setTempReviewData] = useState({
		score: "",
		comment: "",
	});
	const [usersLoans, setUsersLoans] = useState([]);
	const [showUnavailableModal, setShowUnavailableModal] = useState(false);
	const [username, setUsername] = useState("");
	const [showLoanToUserModal, setShowLoanToUserModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState("");
	const [isReserved, setIsReserved] = useState(false);
	const [quantity, setQuantity] = useState(0);
	const [daysLoaned, setDaysLoaned] = useState(0);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);

			const decodedToken = jwtDecode(token);
			const userRole = decodedToken.role;
			setUsername(decodedToken.username);

			if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
				setHasPermissions(true);
			}
		}
	}, []);

	const fetchBookData = useCallback(async () => {
		try {
			const data = await fetchData(
				`/books/title?title=${encodeURIComponent(title)}`
			);
			setBook(data.book);
			setImageSrc(data.image ? `data:image/jpeg;base64,${data.image}` : "");
			setSelectedAuthors(data.book.authors || []);
			setSelectedGenres(data.book.genres || []);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	}, [title]);

	const fetchExistingReview = useCallback(async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			const data = await fetchData(
				`/reviews/user/${title}`,
				"GET",
				null,
				token
			);

			if (data.existingReview) {
				setAlreadyRated(true);
				setCurrentUserScore(data.currentUserScore);
				setCurrentUserComment(data.currentUserComment);
			}
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	}, [title]);

	const fetchQuantity = async () => {
		try {
			const data = await fetchData(
				`/books/getQuantity?title=${encodeURIComponent(title)}`,
				"GET"
			);
			setQuantity(data);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	useEffect(() => {
		const checkLoanStatus = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;

			try {
				const response = await fetchData(
					"/isLoaned",
					"POST",
					{ title: title },
					token
				);
				setLoanStatus(response);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		};

		const checkReservationStatus = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;

			try {
				const response = await fetchData(
					`/isReserved?title=${encodeURIComponent(title)}`,
					"GET",
					null,
					token
				);
				setIsReserved(response);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		};

		const fetchReviews = async () => {
			try {
				const data = await fetchData(`/reviews/${title}`);
				setReviews(data);

				const token = localStorage.getItem("token");
				if (token) {
					//for each review, fetch user vote
					const updatedReviews = await Promise.all(
						data.map(async (review) => {
							const userVote = await fetchUserVote(review.id, token);
							return {
								...review,
								userLiked: userVote === "liked",
								userDisliked: userVote === "disliked",
							};
						})
					);
					setReviews(updatedReviews);
				}
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		};

		const fetchAuthors = async () => {
			const endpoint = "/authors/search";
			try {
				const data = await fetchData(endpoint, "GET");
				setAuthors(data);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
				setAuthors([]);
			}
		};

		const fetchGenres = async () => {
			const endpoint = "/genres/search";
			try {
				const data = await fetchData(endpoint, "GET");
				setGenres(data);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
				setGenres([]);
			}
		};

		fetchBookData();
		fetchReviews();
		fetchAuthors();
		fetchGenres();
		checkLoanStatus();
		checkReservationStatus();
		fetchExistingReview();
		fetchQuantity();
	}, [title, fetchBookData, fetchExistingReview]);

	const handleReviewChange = (e) => {
		const { name, value } = e.target;
		setReviewData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleReviewSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(
				"/reviews",
				"POST",
				{
					title,
					score: reviewData.score,
					comment: reviewData.comment,
				},
				token
			);

			const reviewsData = await fetchData(`/reviews/${title}`);
			setReviews(reviewsData);
			setReviewData({ score: "", comment: "" });
			setAlreadyRated(true);
			await fetchExistingReview();
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleEditClick = (attribute) => {
		if (attribute === "quantity") {
			navigate(`/bookCopies/${title}`);
			return;
		}
		setEditingAttribute(attribute);
		setEditValue(book[attribute]);
		if (attribute === "authors") {
			setSelectedAuthors(book.authors || []);
		} else if (attribute === "genres") {
			setSelectedGenres(book.genres || []);
		}
	};

	const handleEditChange = (e) => {
		setEditValue(e.target.value);
	};

	const handleAuthorChange = (e) => {
		const options = e.target.options;
		const selectedValues = [];
		for (const option of options) {
			if (option.selected) {
				selectedValues.push(option.value);
			}
		}
		setSelectedAuthors(selectedValues);
	};

	const handleGenreChange = (e) => {
		const options = e.target.options;
		const selectedValues = [];
		for (const option of options) {
			if (option.selected) {
				selectedValues.push(option.value);
			}
		}
		setSelectedGenres(selectedValues);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		if (editingAttribute === "quantity" && editValue < 0) {
			toast.info("Quantity cannot be less than 0");
			return;
		}

		const payload = new FormData();
		payload.append("title", title);
		payload.append("attribute", editingAttribute);
		if (editingAttribute === "authors") {
			payload.append("value", JSON.stringify(selectedAuthors));
		} else if (editingAttribute === "genres") {
			payload.append("value", JSON.stringify(selectedGenres));
		} else if (editingAttribute === "isAdult") {
			const booleanValue = editValue === "true";
			payload.append("value", booleanValue);
		} else {
			payload.append("value", editValue);
		}
		if (newImage) {
			try {
				const resizedImageBlob = await compressImage(newImage, 300, 300);
				payload.append("image", resizedImageBlob);
			} catch (error) {
				toast.error("Error resizing image: " + error.message);
				return;
			}
		}

		try {
			const updatedBook = await fetchData("/books", "PUT", payload, token);

			setBook(updatedBook);
			setEditingAttribute(null);

			if (editingAttribute === "title") {
				navigate(`/viewBook/${editValue}`);
			} else {
				fetchBookData();
			}
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleCloseModal = () => {
		setEditingAttribute(null);
	};

	const handleImageChange = (e) => {
		setNewImage(e.target.files[0]);
	};

	const handleDeleteBook = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(`/books/${title}`, "DELETE", null, token);
			setShowDeleteConfirmation(false);
			navigate("/");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleReservation = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(
				`/reserveByTitle?title=${encodeURIComponent(title)}`,
				"POST",
				null,
				token
			);
			toast.success("Book reserved");
			setIsReserved(true);
			await fetchQuantity();
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleCancelReservation = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(
				`/cancelReservation?title=${encodeURIComponent(title)}`,
				"POST",
				null,
				token
			);
			toast.success("Reservation canceled");
			setIsReserved(false);
			await fetchQuantity();
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleEditReview = () => {
		setIsEditing(true);
		setTempReviewData({ score: currentUserScore, comment: currentUserComment });
	};

	const handleTempReviewChange = (e) => {
		const { name, value } = e.target;
		setTempReviewData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleTempStarClick = (star) => {
		setTempReviewData((prevData) => ({
			...prevData,
			score: star,
		}));
	};

	const handleSaveEditedReview = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(
				"/reviews",
				"PUT",
				{
					title,
					score: tempReviewData.score,
					comment: tempReviewData.comment,
				},
				token
			);

			setCurrentUserScore(tempReviewData.score);
			setCurrentUserComment(tempReviewData.comment);
			setIsEditing(false);
			fetchExistingReview();
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setTempReviewData({ score: "", comment: "" });
	};

	const handleDeleteReview = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData(`/reviews/${title}`, "DELETE", null, token);

			setAlreadyRated(false);
			setReviewData({ score: "", comment: "" });
			setCurrentUserScore("");
			setCurrentUserComment("");

			const reviewsData = await fetchData(`/reviews/${title}`);
			setReviews(reviewsData);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleReturnModal = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		try {
			await fetchData("/return", "PUT", { title: title }, token);
			setUsersLoans((prevLoans) =>
				prevLoans.filter((item) => item !== username)
			);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const fetchUserVote = async (reviewId, token) => {
		try {
			const response = await fetchData(
				`/getUserVote?reviewId=${reviewId}`,
				"GET",
				null,
				token
			);
			return response;
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleVotes = async (reviewId, value) => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		const review = reviews.find((r) => r.id === reviewId);

		let updatedReviews;

		if ((value && review.userLiked) || (!value && review.userDisliked)) {
			// User has already voted the same way, remove the vote
			updatedReviews = reviews.map((r) =>
				r.id === reviewId
					? {
							...r,
							userLiked: false,
							userDisliked: false,
							reviewLikes: value ? r.reviewLikes - 1 : r.reviewLikes,
							reviewDislikes: !value ? r.reviewDislikes - 1 : r.reviewDislikes,
					  }
					: r
			);

			try {
				await fetchData(
					`/deleteVote?reviewId=${reviewId}`,
					"DELETE",
					null,
					token
				);
				setReviews(updatedReviews);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		} else {
			// Update votes and ensure only one type of vote is active
			updatedReviews = reviews.map((r) =>
				r.id === reviewId
					? {
							...r,
							userLiked: value,
							userDisliked: !value,
							reviewLikes: value
								? r.userLiked
									? r.reviewLikes
									: r.reviewLikes + 1
								: r.userLiked
								? r.reviewLikes - 1
								: r.reviewLikes,
							reviewDislikes: !value
								? r.userDisliked
									? r.reviewDislikes
									: r.reviewDislikes + 1
								: r.userDisliked
								? r.reviewDislikes - 1
								: r.reviewDislikes,
					  }
					: r
			);

			try {
				let body = {
					reviewId: reviewId,
					positive: value,
				};
				await fetchData(`/addVote`, "PUT", body, token);
				setReviews(updatedReviews);
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		}
	};

	const handleLoanToUser = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("No token found, user might not be authenticated");
			return;
		}

		if (quantity < 1) {
			setShowLoanToUserModal(false);
			return;
		}

		try {
			const response = await fetchData(
				`/loan/${selectedUser}`,
				"POST",
				{
					bookTitle: book.title,
					daysLoaned: daysLoaned,
				},
				token
			);

			if (response.message) {
				toast.success("Book loaned to user successfully");
				await fetchQuantity();
			} else {
				toast.error(response.message || "Something went wrong");
			}
			setShowLoanToUserModal(false);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	if (!book) {
		return (
			<div className="modal-book">
				<span className="page left"></span>
				<span className="middle"></span>
				<span className="page right"></span>
			</div>
		);
	}

	return (
		<main className="container mt-5">
			{hasPermissions && (
				<BookLoansModal
					usersLoans={usersLoans}
					onReturnLoan={handleReturnModal}
				/>
			)}

			{/* Info, edition and requesting book */}
			<h1 className="display-4 text-center mb-4">{book.title}</h1>
			<section className="row">
				<div className="col-md-6 mb-3 d-flex flex-column align-items-center justify-content-center">
					<img
						src={imageSrc ? imageSrc : defaultBook}
						alt={book.title}
						className="img-fluid"
						style={{
							width: "auto",
							height: "auto",
							maxWidth: "100%",
							maxHeight: "100%",
						}}
					/>

					{isLoggedIn && hasPermissions && (
						<div className="d-flex justify-content-center align-items-center mt-2">
							<div className="row w-100">
								<div className="col">
									<button
										onClick={() => handleEditClick("image")}
										className="btn btn-primary w-100"
									>
										Edit image
									</button>
								</div>
								<div className="col">
									<button
										onClick={() => setShowLoanToUserModal(true)}
										className="btn btn-secondary w-100"
										disabled={quantity < 1} // Disable button if no available copies
									>
										Loan to User
									</button>
								</div>
							</div>
						</div>
					)}

					{/* TODO Check if already reserved or loaned */}
					{isLoggedIn && !hasPermissions && (
						<div className="d-flex justify-content-center align-items-center mt-2">
							{isLoaned ? (
								<button className="btn btn-secondary w-100" disabled>
									Currently Loaned
								</button>
							) : isReserved ? (
								<button
									onClick={handleCancelReservation}
									className="btn btn-warning w-100"
								>
									Cancel Reservation
								</button>
							) : (
								<button
									onClick={handleReservation}
									className="btn btn-primary w-100"
									disabled={quantity < 1}
								>
									{quantity < 1 ? "No available copies" : "Make a Reservation"}
								</button>
							)}
						</div>
					)}
				</div>
				<div className="col-md-6 mb-3">
					{[
						{ label: "Title", value: book.title, key: "title" },
						{
							label: "Authors",
							value: book.authors?.join(", ") || "N/A",
							key: "authors",
						},
						{
							label: "Genres",
							value: book.genres?.join(", ") || "N/A",
							key: "genres",
						},
						{ label: "Available Copies", value: quantity, key: "quantity" },
						{ label: "Location", value: book.location, key: "location" },
						{ label: "Synopsis", value: book.synopsis, key: "synopsis" },
						{
							label: "Publication Date",
							value: book.publicationDate,
							key: "publicationDate",
						},
						{
							label: "Adult",
							value: book.adult ? "Yes" : "No",
							key: "isAdult",
						},
					].map(({ label, value, key }) => (
						<div className="mb-2" key={key}>
							<p className="mb-0">
								<strong>{label}:</strong> {value}
							</p>
							{isLoggedIn && hasPermissions && (
								<button
									onClick={() => handleEditClick(key)}
									className="btn btn-primary mt-1"
								>
									Edit
								</button>
							)}
						</div>
					))}
				</div>
			</section>
			{isLoggedIn && hasPermissions && (
				<div className="col-12 d-flex justify-content-between mb-3">
					<button
						onClick={() => setShowDeleteConfirmation(true)}
						className="btn btn-danger ml-2"
					>
						Delete Book
					</button>
				</div>
			)}

			{/* Review sender */}
			{isLoggedIn && !alreadyRated && (
				<form onSubmit={handleReviewSubmit} className="mb-5">
					<div className="form-group">
						<label>Score:</label>
						<div className="star-rating">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									type="button"
									key={star}
									className={star <= (hover || reviewData.score) ? "on" : "off"}
									onClick={() =>
										setReviewData((prevData) => ({ ...prevData, score: star }))
									}
									onMouseEnter={() => setHover(star)}
									onMouseLeave={() => setHover(reviewData.score)}
									style={{
										background: "none",
										border: "none",
										cursor: "pointer",
										fontSize: "2rem",
										color:
											star <= (hover || reviewData.score) ? "gold" : "grey",
									}}
								>
									<span className="star">&#9733;</span>
								</button>
							))}
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="comment">Comment:</label>
						<textarea
							className="form-control"
							id="comment"
							name="comment"
							value={reviewData.comment}
							onChange={handleReviewChange}
							required
						></textarea>
					</div>
					<button type="submit" className="btn btn-primary mt-3">
						Submit Review
					</button>
				</form>
			)}

			{/* Your review */}
			{isLoggedIn &&
				alreadyRated &&
				(isEditing ? (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSaveEditedReview();
						}}
					>
						<div className="form-group">
							<label>Score:</label>
							<div className="star-rating">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										type="button"
										key={star}
										className={star <= tempReviewData.score ? "on" : "off"}
										onClick={() => handleTempStarClick(star)}
										style={{
											background: "none",
											border: "none",
											cursor: "pointer",
											fontSize: "2rem",
											color: star <= tempReviewData.score ? "gold" : "grey",
										}}
									>
										<span className="star">&#9733;</span>
									</button>
								))}
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="comment">Comment:</label>
							<textarea
								className="form-control"
								id="comment"
								name="comment"
								value={tempReviewData.comment}
								onChange={handleTempReviewChange}
								required
							></textarea>
						</div>
						<button type="submit" className="btn btn-primary mt-3">
							Save
						</button>
						<button
							type="button"
							className="btn btn-secondary mt-3 ms-2"
							onClick={handleCancelEdit}
						>
							Cancel
						</button>
					</form>
				) : (
					<section className="p-3 card user-review">
						<h4>Your Review</h4>
						<div className="form-group">
							<div className="star-rating">
								{[1, 2, 3, 4, 5].map((star) => (
									<span
										key={star}
										className="star"
										style={{
											fontSize: "2rem",
											color: star <= currentUserScore ? "gold" : "grey",
										}}
									>
										&#9733;
									</span>
								))}
							</div>
						</div>
						<div className="form-group">
							<p className="user-comment">{currentUserComment}</p>
						</div>
						<div className="d-flex justify-content-between">
							<button
								className="btn btn-warning mt-3"
								style={{
									width: "130px",
									height: "40px",
								}}
								onClick={handleEditReview}
							>
								Edit Review
							</button>
							<button
								className="btn btn-danger mt-3"
								onClick={handleDeleteReview}
								style={{
									width: "130px",
									height: "40px",
								}}
							>
								Delete Review
							</button>
						</div>
					</section>
				))}

			{/* All reviews */}
			<h2 className="mt-5">Reviews</h2>
			<section className="list-group mb-3">
				{reviews.length > 0 &&
				reviews.filter((review) => review.userName !== username).length > 0 ? (
					reviews
						.filter((review) => review.userName !== username)
						.map((review) => (
							<article key={review.id} className="card p-3 mb-4">
								<p className="d-flex align-items-center">
									<span
										style={{
											border: "1px solid black",
											display: "inline-block",
											width: "50px",
											height: "50px",
											borderRadius: "50%",
											backgroundImage: review.profileImage
												? `url(data:image/jpeg;base64,${review.profileImage})`
												: `url(${defaultAvatar})`,
											backgroundPosition: "center",
											backgroundSize: "cover",
											backgroundRepeat: "no-repeat",
											cursor: "pointer",
											marginRight: "10px",
										}}
									></span>
									{review.userName}
								</p>
								<p>
									{[1, 2, 3, 4, 5].map((star) => (
										<span
											key={star}
											className="star"
											style={{
												fontSize: "2rem",
												color: star <= review.score ? "gold" : "grey",
											}}
										>
											&#9733;
										</span>
									))}
								</p>
								<p>{review.comment}</p>
								<div className="d-flex justify-content-start">
									<div className="d-flex align-items-center me-3">
										<button
											onClick={() => handleVotes(review.id, false)}
											className="btn btn-link p-0"
										>
											<i
												className={`bi ${
													review.userDisliked
														? "bi-hand-thumbs-down-fill"
														: "bi-hand-thumbs-down"
												}`}
												style={{
													fontSize: "1.5rem",
													color: review.userDisliked ? "#dc3545" : "inherit",
												}}
											></i>
										</button>
										<p className="mb-0 ms-2">{review.reviewDislikes}</p>
									</div>
									<div className="d-flex align-items-center">
										<button
											onClick={() => handleVotes(review.id, true)}
											className="btn btn-link p-0"
										>
											<i
												className={`bi ${
													review.userLiked
														? "bi-hand-thumbs-up-fill"
														: "bi-hand-thumbs-up"
												}`}
												style={{
													fontSize: "1.5rem",
													color: review.userLiked ? "#28a745" : "inherit",
												}}
											></i>
										</button>
										<p className="mb-0 ms-2">{review.reviewLikes}</p>
									</div>
								</div>
							</article>
						))
				) : (
					<p>No reviews available</p>
				)}
			</section>

			<EditBookAttributeModal
				editingAttribute={editingAttribute}
				editValue={editValue}
				authors={authors}
				selectedAuthors={selectedAuthors}
				genres={genres}
				selectedGenres={selectedGenres}
				handleAuthorChange={handleAuthorChange}
				handleGenreChange={handleGenreChange}
				handleEditChange={handleEditChange}
				handleEditSubmit={handleEditSubmit}
				handleCloseModal={handleCloseModal}
				handleImageChange={handleImageChange}
			/>

			<DeleteConfirmationModal
				show={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				onDelete={handleDeleteBook}
				message={`This book "${book.title}" will be deleted. Are you sure?`}
			/>

			<BookReservationModal
				show={showUnavailableModal}
				onClose={() => setShowUnavailableModal(false)}
				onConfirm={handleReservation}
				onCancel={() => setShowUnavailableModal(false)}
			/>

			<LoanToUserModal
				show={showLoanToUserModal}
				onClose={() => setShowLoanToUserModal(false)}
				onConfirm={handleLoanToUser}
				selectedUser={selectedUser}
				setSelectedUser={setSelectedUser}
				daysLoaned={daysLoaned}
				setDaysLoaned={setDaysLoaned}
			/>
		</main>
	);
}
