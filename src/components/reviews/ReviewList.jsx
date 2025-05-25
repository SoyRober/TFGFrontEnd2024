import { useEffect, useState } from "react";
import defaultAvatar from "/img/defaultAvatar.svg";
import { fetchData } from "../../utils/fetch";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";

export default function ReviewList({ title, username }) {
  const [reviews, setReviews] = useState([]);
  const [loadingVote, setLoadingVote] = useState(false);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    setReviews([]);
    setPage(0);
    fetchReviews(0);
  }, [title, username]);

  const updateReviewVotes = (review, value, isRemovingVote) => {
    const updatedReview = { ...review };

    if (isRemovingVote) {
      updatedReview.userLiked = false;
      updatedReview.userDisliked = false;
      updatedReview.reviewLikes = value
        ? review.reviewLikes - 1
        : review.reviewLikes;
      updatedReview.reviewDislikes = !value
        ? review.reviewDislikes - 1
        : review.reviewDislikes;
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

      if (isRemovingVote) {
        await fetchData(
          `/user/deleteVote?reviewId=${reviewId}`,
          "DELETE",
          null,
          token
        );
      } else {
        const body = { reviewId, positive: value };
        await fetchData(`/user/addVote`, "PUT", body, token);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoadingVote(false);
    }
  };

  const debouncedHandleVotes = debounce(handleVotes, 300);

  const fetchReviews = async (pageToFetch) => {
    setIsFetching(true);
    try {
      const data = await fetchData(`/public/reviews/${title}?page=${pageToFetch}`);
      setHasFetchedOnce(true);

      let reviewsToSet = data;

      const token = localStorage.getItem("token");
      if (token && username) {
        const filteredData = data.filter((review) => review.userName !== username);

        const updatedReviews = await Promise.all(
          filteredData.map(async (review) => {
            const userVote = await fetchUserVote(review.id, token);
            return {
              ...review,
              userLiked: userVote === "liked",
              userDisliked: userVote === "disliked",
            };
          })
        );

        reviewsToSet = updatedReviews;
      }

      setReviews((prev) => [...prev, ...reviewsToSet]);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUserVote = async (reviewId, token) => {
    try {
      const response = await fetchData(
        `/user/getUserVote?reviewId=${reviewId}`,
        "GET",
        null,
        token
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      return null;
    }
  };

  return (
    <section className="list-group mb-4" aria-label="Review List Section">
      {reviews.length === 0 && hasFetchedOnce ? (
        <div className="alert alert-info text-center" role="alert">
          There are no reviews for now.
        </div>
      ) : (
        <InfiniteScroll
          dataLength={reviews.length}
          next={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchReviews(nextPage);
          }}
          hasMore={!isFetching && reviews.length % 10 === 0}
          loader={<Loading />}
          endMessage={
            <p
              className="text-center mt-3 text-muted fst-italic"
              aria-label="No More Reviews Message"
            >
              There aren't more reviews
            </p>
          }
          style={{ overflow: "hidden" }}
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="card p-4 mb-4 shadow border-1"
              aria-label={`Review by ${review.userName}`}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundImage: review.profileImage
                      ? `url(data:image/jpeg;base64,${review.profileImage})`
                      : `url(${defaultAvatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                  className="border border-2"
                  title={review.userName}
                  role="img"
                  aria-label="Reviewer Avatar"
                ></div>
                <h5 className="mb-0 ms-3 fw-bold">{review.userName}</h5>
              </div>

              <div
                aria-label="Review Rating"
                className="mb-3"
                role="img"
                aria-roledescription="stars"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="me-1"
                    style={{
                      fontSize: "1.6rem",
                      color: star <= review.score ? "#f4c150" : "#dee2e6",
                    }}
                    aria-label={`Star ${star} ${
                      star <= review.score ? "filled" : "empty"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                className="mb-4 fst-italic text-secondary"
                aria-label="Review Comment"
              >
                “{review.comment}”
              </p>

              <div className="d-flex gap-4">
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => debouncedHandleVotes(review.id, true)}
                    className={`btn d-flex align-items-center ${
                      review.userLiked ? "btn-success" : "btn-outline-success"
                    }`}
                    aria-label="Like review"
                  >
                    <i
                      className={`fa-${
                        review.userLiked ? "solid" : "regular"
                      } fa-thumbs-up`}
                      style={{ fontSize: "1.3rem" }}
                      aria-hidden="true"
                    ></i>
                  </button>
                  <span className="ms-2 fw-semibold" aria-label="Like Count">
                    {review.reviewLikes}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <button
                    onClick={() => handleVotes(review.id, false)}
                    className={`btn d-flex align-items-center ${
                      review.userDisliked ? "btn-danger" : "btn-outline-danger"
                    }`}
                    aria-label="Dislike review"
                  >
                    <i
                      className={`fa-${
                        review.userDisliked ? "solid" : "regular"
                      } fa-thumbs-down`}
                      style={{ fontSize: "1.3rem" }}
                      aria-hidden="true"
                    ></i>
                  </button>
                  <span className="ms-2 fw-semibold" aria-label="Dislike Count">
                    {review.reviewDislikes}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </InfiniteScroll>
      )}
    </section>
  );
}
