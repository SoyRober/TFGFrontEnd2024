import { useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../../utils/fetch.js";

const SubmitReview = ({
	title,
	isLoggedIn,
	alreadyRated,
	setAlreadyRated,
	fetchExistingReview,
}) => {
	const [reviewData, setReviewData] = useState({ score: "", comment: "" });
	const [hover, setHover] = useState(null);

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

		if (reviewData.score < 1 || reviewData.score > 5) {
			toast.error("Score must be between 1 and 5");
			return;
		}

		try {
			await fetchData(
				"/user/reviews",
				"POST",
				{
					title,
					score: reviewData.score,
					comment: reviewData.comment,
				},
				token
			);
			toast.success("Review submitted successfully");
			setAlreadyRated(true);
			await fetchExistingReview();
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	return (
		<div>
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
		</div>
	);
};

export default SubmitReview;
