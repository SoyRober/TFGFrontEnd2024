import React, { useState } from "react";

const SubmitReview = ({
    isLoggedIn,
    alreadyRated,
    handleReviewSubmit,
    handleReviewChange,
    reviewData,
    setReviewData,
    handleSaveEditedReview,
    handleTempStarClick,
    handleTempReviewChange,
    handleCancelEdit,
    handleEditReview,
    handleDeleteReview,
    tempReviewData,
    isEditing,
    currentUserScore,
    currentUserComment,
}) => {
    const [hover, setHover] = useState(null);

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
        </div>
    );
};

export default SubmitReview;