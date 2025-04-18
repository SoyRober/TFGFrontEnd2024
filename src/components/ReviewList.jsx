import { useEffect, useState } from "react";
import defaultAvatar from "../img/defaultAvatar.svg";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import { debounce } from "lodash";

export default function ReviewList({ title, username }) {
  const [reviews, setReviews] = useState([]);
  const [loadingVote, setLoadingVote] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReviewVotes = (review, value, isRemovingVote) => {
    const updatedReview = { ...review };

    if (isRemovingVote) {
      updatedReview.userLiked = false;
      updatedReview.userDisliked = false;
      updatedReview.reviewLikes = value ? review.reviewLikes - 1 : review.reviewLikes;
      updatedReview.reviewDislikes = !value ? review.reviewDislikes - 1 : review.reviewDislikes;
    } else {
      updatedReview.userLiked = value;
      updatedReview.userDisliked = !value;
      updatedReview.reviewLikes = value
        ? review.userLiked
          ? review.reviewLikes
          : review.reviewLikes + 1
        : review.userLiked
        ? review.reviewLikes - 1
        : review.reviewLikes;
      updatedReview.reviewDislikes = !value
        ? review.userDisliked
          ? review.reviewDislikes
          : review.reviewDislikes + 1
        : review.userDisliked
        ? review.reviewDislikes - 1
        : review.reviewDislikes;
    }

    return updatedReview;
  };

  const handleVotes = async (reviewId, value) => {
    if (loadingVote) return;

    setLoadingVote(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, user might not be authenticated");
        return;
      }

      const review = reviews.find((r) => r.id === reviewId);
      if (!review) {
        toast.error("Review not found");
        return;
      }

      const isRemovingVote =
        (value && review.userLiked) || (!value && review.userDisliked);

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId ? updateReviewVotes(r, value, isRemovingVote) : r
        )
      );

      try {
        if (isRemovingVote) {
          await fetchData(`/deleteVote?reviewId=${reviewId}`, "DELETE", null, token);
        } else {
          const body = { reviewId, positive: value };
          await fetchData(`/addVote`, "PUT", body, token);
        }
      } catch (error) {
        toast.error(error.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingVote(false);
    }
  };

  const debouncedHandleVotes = debounce(handleVotes, 300);

  const fetchReviews = async () => {
    try {
      const data = await fetchData(`/reviews/${title}`);
      setReviews(data);

      const token = localStorage.getItem("token");
      if (token) {
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

  return (
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
                    aria-label="Dislike review"
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
                    onClick={() => debouncedHandleVotes(review.id, true)}
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
  );
}
