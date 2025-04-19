import { useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "../../utils/fetch";

const UserReview = ({
  isLoggedIn,
  alreadyRated,
  setAlreadyRated,
  title,
  currentUserScore,
  setCurrentUserScore,
  currentUserComment,
  setCurrentUserComment,
  fetchExistingReview,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempReviewData, setTempReviewData] = useState({
    score: "",
    comment: "",
  });

  const starStyles = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "2rem",
  };

  const buttonStyles = {
    width: "130px",
    height: "40px",
  };

  const handleEditReview = () => {
    setIsEditing(true);
    setTempReviewData({ score: currentUserScore, comment: currentUserComment });
  };

  const handleTempReviewChange = (e) => {
    const { name, value } = e.target;
    setTempReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTempStarClick = (star) => {
    setTempReviewData((prevData) => ({ ...prevData, score: star }));
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
      setCurrentUserScore("");
      setCurrentUserComment("");

      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const renderStars = (score, onClick) =>
    [1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        className={star <= score ? "on" : "off"}
        onClick={onClick ? () => onClick(star) : undefined}
        style={{
          ...starStyles,
          color: star <= score ? "gold" : "grey",
        }}
      >
        <span className="star">&#9733;</span>
      </button>
    ));

  if (!isLoggedIn || !alreadyRated) return null;

  return (
    <div>
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEditedReview();
          }}
        >
          <div className="form-group">
            <label>Score:</label>
            <div className="star-rating">
              {renderStars(tempReviewData.score, handleTempStarClick)}
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
            <div className="star-rating">{renderStars(currentUserScore)}</div>
          </div>
          <div className="form-group">
            <p className="user-comment">{currentUserComment}</p>
          </div>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-warning mt-3"
              style={buttonStyles}
              onClick={handleEditReview}
            >
              Edit Review
            </button>
            <button
              className="btn btn-danger mt-3"
              style={buttonStyles}
              onClick={handleDeleteReview}
            >
              Delete Review
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default UserReview;
