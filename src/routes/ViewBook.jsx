import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetch.js";
import { jwtDecode } from "jwt-decode";
import EditBookAttributeModal from "../components/modals/EditBookAttributeModal.jsx";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import BookReservationModal from "../components/modals/BookReservationModal.jsx";
import defaultBook from "/img/defaultBook.svg";
import LoanToUserModal from "../components/modals/LoanToUserModal.jsx";
import { compressImage } from "../utils/compressImage.js";
import { toast } from "react-toastify";
import BookDetails from "../components/BookDetails.jsx";
import ReviewList from "../components/reviews/ReviewList.jsx";
import UserReview from "../components/reviews/UserReview.jsx";
import SubmitReview from "../components/reviews/SubmitReview.jsx";

const IMAGE_DIMENSIONS = { width: 300, height: 300 };
const API_ENDPOINTS = {
  BOOKS: "/librarian/books/update",
  RESERVE: "/user/reserveByTitle",
  CANCEL_RESERVATION: "/user/cancelReservation",
  LOAN: "/librarian/loans",
};

export default function ViewBook() {
  const title = useParams().title.replaceAll("_", " ");
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoaned, setLoanStatus] = useState();
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [username, setUsername] = useState("");
  const [showLoanToUserModal, setShowLoanToUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [daysLoaned, setDaysLoaned] = useState(0);
  const [currentUserScore, setCurrentUserScore] = useState("");
  const [currentUserComment, setCurrentUserComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);

      const checkManagePermission = async () => {
        try {
          const response = await fetchData(
            `/librarian/isManagedByUser/${encodeURIComponent(title)}`,
            "GET",
            null,
            token
          );
          setHasPermissions(response.success === true);
        } catch (error) {
          setHasPermissions(false);
        }
      };

      checkManagePermission();
    }
  }, [title]);

  const fetchBookData = useCallback(async () => {
    try {
      const data = await fetchData(
        `/public/books/title?title=${encodeURIComponent(title)}`
      );
      setBook(data.book);
      setImageSrc(data.image ? `data:image/jpeg;base64,${data.image}` : "");
      setSelectedAuthors(data.book.authors || []);
      setSelectedGenres(data.book.genres || []);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  }, [title]);

  const fetchQuantity = async () => {
    try {
      const data = await fetchData(
        `/public/books/getQuantity?title=${encodeURIComponent(title)}`,
        "GET"
      );
      setQuantity(data);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const fetchExistingReview = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data = await fetchData(
        `/user/reviews/${title}`,
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

  useEffect(() => {
    const checkLoanStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetchData(
          "/user/loans/isLoaned",
          "POST",
          { title: title },
          token
        );
        setLoanStatus(response.message);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    };

    const checkReservationStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetchData(
          `/user/isReserved?title=${encodeURIComponent(title)}`,
          "GET",
          null,
          token
        );
        setIsReserved(response);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    };

    const fetchAuthors = async () => {
      const endpoint = "/public/authors/search";
      try {
        const data = await fetchData(endpoint, "GET");
        setAuthors(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        setAuthors([]);
      }
    };

    const fetchGenres = async () => {
      const endpoint = "/public/genres/search";
      try {
        const data = await fetchData(endpoint, "GET");
        setGenres(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        setGenres([]);
      }
    };

    const fetchLibraries = async () => {
      const endpoint = "/public/libraries/list";
      try {
        const data = await fetchData(endpoint, "GET");
        const libraryNames = data;
        setLibraries(libraryNames);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        setLibraries([]);
      }
    };

    fetchBookData();
    fetchAuthors();
    fetchGenres();
    checkLoanStatus();
    checkReservationStatus();
    fetchExistingReview();
    fetchQuantity();
    fetchLibraries();
  }, [title, fetchBookData, fetchExistingReview]);

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
    } else if (attribute === "libraries") {
      setSelectedLibraries(book.libraries || []);
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

  const handleLibraryChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (const option of options) {
      if (option.selected) {
        selectedValues.push(option.value);
      }
    }
    setSelectedLibraries(selectedValues);
  };

  const handleError = (error, defaultMessage = "Something went wrong") => {
    toast.error(error.message || defaultMessage);
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("title", title);
    payload.append("attribute", editingAttribute);

    switch (editingAttribute) {
      case "authors":
        payload.append("value", JSON.stringify(selectedAuthors));
        break;
      case "genres":
        payload.append("value", JSON.stringify(selectedGenres));
        break;
      case "libraries":
        payload.append("value", JSON.stringify(selectedLibraries));
        break;
      case "isAdult":
        payload.append("value", editValue === "true");
        break;
      default:
        payload.append("value", editValue);
    }

    return payload;
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

    const payload = buildPayload();

    if (newImage) {
      try {
        const resizedImageBlob = await compressImage(
          newImage,
          IMAGE_DIMENSIONS.width,
          IMAGE_DIMENSIONS.height
        );
        payload.append("image", resizedImageBlob);
      } catch (error) {
        handleError(error, "Error resizing image");
        return;
      }
    }

    try {
      const updatedBook = await fetchData(
        API_ENDPOINTS.BOOKS,
        "POST",
        payload,
        token
      );
      setBook(updatedBook);
      setEditingAttribute(null);

      if (editingAttribute === "title") {
        const formattedEditValue = editValue.trim().replaceAll(" ", "_");
        navigate(`/viewBook/${encodeURIComponent(formattedEditValue)}`);
      } else {
        fetchBookData();
      }
    } catch (error) {
      handleError(error);
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
      await fetchData(`/librarian/books/${title}`, "DELETE", null, token);
      setShowDeleteConfirmation(false);
      navigate("/libraryHomepage");
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
        `${API_ENDPOINTS.RESERVE}?title=${encodeURIComponent(title)}`,
        "POST",
        null,
        token
      );
      toast.success("Book reserved");
      setIsReserved(true);
      await fetchQuantity();
    } catch (error) {
      handleError(error);
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
        `${API_ENDPOINTS.CANCEL_RESERVATION}?title=${encodeURIComponent(
          title
        )}`,
        "POST",
        null,
        token
      );
      toast.success("Reservation canceled");
      setIsReserved(false);
      await fetchQuantity();
    } catch (error) {
      handleError(error);
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
        `${API_ENDPOINTS.LOAN}/${selectedUser}`,
        "POST",
        {
          bookTitle: title,
          daysLoaned: daysLoaned,
        },
        token
      );

      if (response.message) {
        toast.success("Book loaned to user successfully");
        await fetchQuantity();
      } else {
        handleError(response);
      }
      setShowLoanToUserModal(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="container mt-0">
      <h1 className="display-4 text-center mb-2">{title}</h1>

      <section className="row">
        <div className="col-md-6 mb-1 d-flex flex-column align-items-center justify-content-start">
          <img
            src={imageSrc ? imageSrc : defaultBook}
            alt={title}
            className="img-fluid mt-2 shadow"
            style={{
              width: "500px",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              marginTop: 0,
              paddingTop: 0,
            }}
          />

          {isLoggedIn && hasPermissions && (
            <div className="d-flex justify-content-center align-items-center mt-2 w-100">
              <div className="row w-100">
                <div className="col">
                  <button
                    onClick={() => handleEditClick("image")}
                    className="btn btn-primary w-100"
                    aria-label="Edit book image"
                  >
                    Edit image
                  </button>
                </div>
                <div className="col">
                  <button
                    onClick={() => setShowLoanToUserModal(true)}
                    className="btn btn-secondary w-100"
                    disabled={quantity < 1}
                    aria-label="Loan book to user"
                  >
                    Loan to User
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoggedIn && !hasPermissions && (
            <div className="d-flex justify-content-center align-items-center mt-2 w-100">
              {isLoaned ? (
                <button
                  className="btn btn-secondary w-100"
                  disabled
                  aria-label="Book is currently loaned"
                >
                  Currently Loaned
                </button>
              ) : isReserved ? (
                <button
                  onClick={handleCancelReservation}
                  className="btn btn-warning w-100"
                  aria-label="Cancel book reservation"
                >
                  Cancel Reservation
                </button>
              ) : (
                <button
                  onClick={handleReservation}
                  className="btn btn-primary w-100"
                  disabled={quantity < 1}
                  aria-label={
                    quantity < 1
                      ? "No available copies to reserve"
                      : "Make a reservation for this book"
                  }
                >
                  {quantity < 1 ? "No available copies" : "Make a Reservation"}
                </button>
              )}
            </div>
          )}
        </div>
        {book && (
          <BookDetails
            book={book}
            quantity={quantity}
            isLoggedIn={isLoggedIn}
            hasPermissions={hasPermissions}
            handleEditClick={handleEditClick}
          />
        )}
      </section>

      {isLoggedIn && hasPermissions && (
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-end">
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="btn btn-danger"
              aria-label="Delete this book"
            >
              Delete Book
            </button>
          </div>
        </div>
      )}

      <SubmitReview
        title={title}
        isLoggedIn={isLoggedIn}
        alreadyRated={alreadyRated}
        setAlreadyRated={setAlreadyRated}
        fetchExistingReview={fetchExistingReview}
      />

      <UserReview
        isLoggedIn={isLoggedIn}
        alreadyRated={alreadyRated}
        setAlreadyRated={setAlreadyRated}
        title={title}
        currentUserScore={currentUserScore}
        setCurrentUserScore={setCurrentUserScore}
        currentUserComment={currentUserComment}
        setCurrentUserComment={setCurrentUserComment}
        fetchExistingReview={fetchExistingReview}
      />

      <section className="mt-5">
        <h2>Reviews</h2>
        <ReviewList title={title} />
      </section>

      <EditBookAttributeModal
        editingAttribute={editingAttribute}
        editValue={editValue}
        authors={authors}
        selectedAuthors={selectedAuthors}
        genres={genres}
        selectedGenres={selectedGenres}
        libraries={libraries}
        selectedLibraries={selectedLibraries}
        handleAuthorChange={handleAuthorChange}
        handleGenreChange={handleGenreChange}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        handleCloseModal={handleCloseModal}
        handleImageChange={handleImageChange}
        handleLibraryChange={handleLibraryChange}
        aria-label="Edit book attributes modal"
      />

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeleteBook}
        message={`This book "${title}" will be deleted. Are you sure?`}
        aria-label="Delete book confirmation modal"
      />

      <BookReservationModal
        show={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        onConfirm={handleReservation}
        onCancel={() => setShowUnavailableModal(false)}
        aria-label="Book reservation modal"
      />

      <LoanToUserModal
        show={showLoanToUserModal}
        onClose={() => setShowLoanToUserModal(false)}
        onConfirm={handleLoanToUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        daysLoaned={daysLoaned}
        setDaysLoaned={setDaysLoaned}
        aria-label="Loan book to user modal"
      />
    </main>
  );
}
