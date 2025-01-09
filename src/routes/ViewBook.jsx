import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch.js";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import BookLoansModal from "../components/BookLoansModal.jsx";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import BookReservationModal from "../components/BookReservationModal.jsx";
import Notification from "../components/Notification";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  const [page, setPage] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
        setHasPermissions(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const data = await fetchData(
          `/getBookByTitle?title=${encodeURIComponent(title)}`
        );
        setBook(data.book);
        setImageSrc(data.image ? `data:image/jpeg;base64,${data.image}` : "");
        setSelectedAuthors(data.book.authors || []);
        setSelectedGenres(data.book.genres || []);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    const fetchUsersLoans = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        //console.error("No token found, user might not be authenticated");
        return;
      }
      try {
        const data = await fetchData(
          `/usersLoans?page=${page}&size=10`,
          "POST",
          title,
          token,
          "text/plain"
        );
        setUsersLoans(data.message);
      } catch (error) {
        console.error(error);
      }
    };

    const checkLoanStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        //console.error("No token found, user might not be authenticated");
        return;
      }

      try {
        const response = await fetchData(
          "/isLoaned",
          "POST",
          { title: title },
          token
        );
        setLoanStatus(response);
      } catch (error) {
        console.error("Failed to check loan status:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await fetchData(
          `/getReviewsByBookTitle?title=${encodeURIComponent(title)}`
        );
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const fetchAuthors = async () => {
      const endpoint = "/searchAuthors";
      try {
        const data = await fetchData(endpoint, "POST");
        setAuthors(data);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
        setAuthors([]);
      }
    };

    const fetchGenres = async () => {
      const endpoint = "/searchGenres";
      try {
        const data = await fetchData(endpoint, "POST");
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
    };

    const autoCheckExistingReview = async () => {
      fetchExistingReview();
    };

    fetchBookData();
    fetchReviews();
    fetchAuthors();
    fetchGenres();
    checkLoanStatus();
    autoCheckExistingReview();
    fetchUsersLoans();
  }, [title]);

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
      return;
    }

    try {
      await fetchData(
        "/addReview",
        "POST",
        {
          title,
          score: reviewData.score,
          comment: reviewData.comment,
        },
        token
      );

      const reviewsData = await fetchData(
        `/getReviewsByBookTitle?title=${encodeURIComponent(title)}`
      );
      setReviews(reviewsData);
      setReviewData({ score: "", comment: "" });
      await fetchExistingReview();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const fetchExistingReview = async () => {
    if (!token) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const data = await fetchData(
        `/getReview?title=${encodeURIComponent(title)}`,
        "GET",
        null,
        token
      );

      if (data.existingReview == true) {
        setAlreadyRated(true);
        setCurrentUserScore(data.currentUserScore);
        setCurrentUserComment(data.currentUserComment);
      }
    } catch (error) {
      console.error("Failed to fetch Existing Review:", error);
    }
  };

  const handleEditClick = (attribute) => {
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
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedAuthors(selectedValues);
  };

  const handleGenreChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedGenres(selectedValues);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
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
        // Redimensionar la imagen antes de enviarla
        const resizedImageBlob = await resizeImage(newImage, 300, 300); // Tamaño deseado
        payload.append("image", resizedImageBlob);
      } catch (error) {
        console.error("Error resizing image:", error);
        return;
      }
    }

    try {
      const updatedBook = await fetchData(
        "/updateBook",
        "POST",
        payload,
        token
      );
      setBook(updatedBook);
      setEditingAttribute(null);

      if (editingAttribute === "title") {
        navigate(`/viewBook/${editValue}`);
      } else {
        location.reload();
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  // Función para redimensionar imágenes
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const { width, height } = img;
          const ratio = width / height;

          canvas.width = width > maxWidth ? maxWidth : width;
          canvas.height = height > maxHeight ? maxHeight : height;

          if (canvas.width / ratio > maxHeight) {
            canvas.height = maxHeight;
            canvas.width = Math.round(maxHeight * ratio);
          } else if (canvas.width < maxWidth) {
            canvas.height = Math.round(canvas.width / ratio);
          }

          canvas
            .getContext("2d")
            .drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) =>
              blob ? resolve(blob) : reject(new Error("Canvas is empty")),
            "image/jpeg",
            0.75
          );
        };
        img.onerror = reject;
        img.src = result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCloseModal = () => {
    setEditingAttribute(null);
  };

  const renderEditModal = () => {
    if (!editingAttribute) return null;

    let inputField;

    switch (editingAttribute) {
      case "authors":
        inputField = (
          <select
            multiple
            className="form-control"
            id="editValue"
            value={selectedAuthors}
            onChange={handleAuthorChange}
            required
          >
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>
        );
        break;
      case "genres":
        inputField = (
          <select
            multiple
            className="form-control"
            id="editGenres"
            value={selectedGenres}
            onChange={handleGenreChange}
            required
          >
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        );
        break;
      case "quantity":
        inputField = (
          <input
            type="number"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
        break;
      case "isAdult":
        inputField = (
          <select
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        );
        break;
      case "publicationDate":
        inputField = (
          <input
            type="date"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
        break;
      case "image":
        inputField = (
          <input
            type="file"
            className="form-control"
            id="editImage"
            onChange={handleImageChange}
            required
          />
        );
        break;
      default:
        inputField = (
          <input
            type="text"
            className="form-control"
            id="editValue"
            value={editValue}
            onChange={handleEditChange}
            required
          />
        );
    }

    return (
      <div className="modal show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit {editingAttribute}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="editValue">New Value</label>
                  {inputField}
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleDeleteBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData(
        `/deleteBook?title=${encodeURIComponent(title)}`,
        "DELETE",
        null,
        token
      );
      setShowDeleteConfirmation(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleLoanClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      const response = await fetchData(
        `/isAvailable?title=${encodeURIComponent(title)}`,
        "POST",
        null,
        token
      );
      if (response == false) {
        setIsAvailable(false);
        setShowUnavailableModal(true);
        return;
      }
      setIsAvailable(true);
    } catch (error) {
      console.error("Error en isBookAvailable:", error);
      return false;
    }

    try {
      if (!isLoaned && isAvailable) {
        await fetchData("/loan", "POST", title, token, "text/plain");
        setLoanStatus(true);
      }
      if (isLoaned) {
        console.log("return: " + isAvailable);

        await fetchData("/return", "PUT", { title: title }, token);
        setLoanStatus(false);
      }
    } catch (error) {
      alert(error.message);
      console.error("Failed to update loan status:", error);
    }
  };

  const handleReservation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      const response = await fetchData(
        `/reserve?title=${encodeURIComponent(title)}`,
        "POST",
        null,
        token
      );
      console.log(response);
      setNotificationMessage("Book reserved");
      setNotificationKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(error);
      setNotificationMessage(error.message);
      setNotificationKey((prevKey) => prevKey + 1);
      return;
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
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData(
        "/editReview",
        "POST",
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
      console.error("Failed to edit review:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempReviewData({ score: "", comment: "" });
  };

  const handleDeleteReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData(
        `/deleteReview?title=${encodeURIComponent(title)}`,
        "DELETE",
        null,
        token
      );

      setAlreadyRated(false);
      setReviewData({ score: "", comment: "" });
      setCurrentUserScore("");
      setCurrentUserComment("");

      const reviewsData = await fetchData(
        `/getReviewsByBookTitle?title=${encodeURIComponent(title)}`
      );
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleReturnModal = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData("/return", "PUT", title, token, "text/plain");
    } catch (error) {
      alert(error.message);
      console.error("Failed to update loan status:", error);
    }
  };

  const handleVotes = async (reviewId, value) => {
    console.log("🚀 ~ handleVotes ~ value:", value);
    console.log("🚀 ~ handleThumbsUp ~ reviewId:", reviewId);

    const token = localStorage.getItem("token");
    if (!token) {
      //TODO MODAL to suggest LOGIN
      return;
    }

    //TODO if already voted, remove vote
    setDisliked(!value);
    setLiked(value);
    //TODO recharge the value of the vote

    let body = {
      reviewId: reviewId,
      positive: value,
    };
    try {
      await fetchData(
        "/addVote",
        "PUT",
        {
          reviewId: reviewId,
          positive: value,
        },
        token
      );
    } catch (error) {
      alert(error.message);
      console.error("Failed to update Vote: ", error);
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
    <div className="container mt-5">
      {hasPermissions && (
        <BookLoansModal
          usersLoans={usersLoans}
          onReturnLoan={handleReturnModal}
        />
      )}

      <h1 className="display-4 text-center mb-4">{book.title}</h1>
      <div className="row">
        <div>
          {isLoggedIn && (
            <>
              <button
                onClick={handleLoanClick}
                className={isLoaned ? "btn btn-danger" : "btn btn-primary"}
              >
                {isLoaned ? "Return" : "Loan"}
              </button>
              {hasPermissions && (
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="btn btn-danger ml-2"
                >
                  Delete Book
                </button>
              )}
            </>
          )}
        </div>
        <div className="col-md-6 mb-3">
          {imageSrc ? (
            <img src={imageSrc} alt={book.title} className="img-fluid" />
          ) : (
            <div>No image available</div>
          )}
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("image")}
              className="btn btn-primary"
            >
              Edit image
            </button>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <p>
            <span className="label">Title:</span> {book.title}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("title")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Authors:</span>{" "}
            {book.authors ? book.authors.join(", ") : "N/A"}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("authors")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Genres:</span>{" "}
            {book.genres ? book.genres.join(", ") : "N/A"}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("genres")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Quantity:</span> {book.quantity}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("quantity")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Location:</span> {book.location}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("location")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Synopsis:</span> {book.synopsis}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("synopsis")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Publication Date:</span>{" "}
            {book.publicationDate}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("publicationDate")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}

          <p>
            <span className="label">Adult:</span> {book.adult ? "Yes" : "No"}
          </p>
          {isLoggedIn && hasPermissions && (
            <button
              onClick={() => handleEditClick("isAdult")}
              className="btn btn-primary"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {isLoggedIn && alreadyRated == false && (
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
          <div className="user-review">
            <h4>Your Review</h4>
            <div className="form-group">
              <label>Score:</label>
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
              <label>Comment:</label>
              <p className="user-comment">{currentUserComment}</p>
            </div>
            <button className="btn btn-warning mt-3" onClick={handleEditReview}>
              Edit Review
            </button>
            <button
              className="btn btn-danger mt-3 ms-2"
              onClick={handleDeleteReview}
            >
              Delete Review
            </button>
          </div>
        ))}

      <h2 className="mt-5">Reviews</h2>
      <div className="list-group mb-3">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="list-group-item">
              <p>
                <strong>User:</strong> {review.userName}
              </p>
              <p>
                <strong>Score:</strong> {review.score}
              </p>
              <p>
                <strong>Comment:</strong> {review.comment}
              </p>
              //TODO Decorate better
              <div className="d-flex justify-content-start">
                <div className="d-flex align-items-center me-3">
                  <button
                    onClick={() => handleVotes(review.id, false)}
                    style={{
                      backgroundColor: disliked ? "#ff3535" : "transparent",
                    }}
                  >
                    <i class="bi bi-hand-thumbs-down"></i>
                  </button>
                  <p>{review.reviewDislikes}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => handleVotes(review.id, true)}
                    style={{
                      backgroundColor: liked ? "#35ff35" : "transparent",
                    }}
                  >
                    <i class="bi bi-hand-thumbs-up"></i>
                  </button>
                  <p>{review.reviewLikes}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>

      {renderEditModal()}

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

      <Notification key={notificationKey} message={notificationMessage} />
    </div>
  );
}
