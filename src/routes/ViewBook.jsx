import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch.js";
import { jwtDecode } from "jwt-decode";
import EditBookAttributeModal from "../components/modals/EditBookAttributeModal.jsx";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import BookReservationModal from "../components/modals/BookReservationModal.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import defaultBook from "../img/defaultBook.svg";
import LoanToUserModal from "../components/modals/LoanToUserModal.jsx";
import { compressImage } from "../utils/compressImage.js";
import { toast } from "react-toastify";
import BookDetails from "../components/BookDetails.jsx";
import ReviewList from "../components/ReviewComponents/ReviewList.jsx";
import UserReview from "../components/ReviewComponents/UserReview.jsx";

export default function ViewBook() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
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

    const fetchLibraries = async () => {
      const endpoint = "/libraries/list";
      try {
        const data = await fetchData(endpoint, "GET");
        const libraryNames = data.map((library) => library.name);
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
        "/reviews",
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
      setSelectedLibraries(book.libraries || []); // Asegúrate de que `book.libraries` contenga los nombres
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
    } else if (editingAttribute === "libraries") {
      payload.append("value", JSON.stringify(selectedLibraries));
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

        <BookDetails
          book={book}
          quantity={quantity}
          isLoggedIn={isLoggedIn}
          hasPermissions={hasPermissions}
          handleEditClick={handleEditClick}
        />
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
      <SubmitReview />

      {/* Your review */}
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

      {/* All reviews */}
      <h2 className="mt-5">Reviews</h2>
      <ReviewList title={title} username={username}/>

      <EditBookAttributeModal
        editingAttribute={editingAttribute}
        editValue={editValue}
        authors={authors}
        selectedAuthors={selectedAuthors}
        genres={genres}
        selectedGenres={selectedGenres}
        libraries={libraries} // Todas las librerías disponibles
        selectedLibraries={selectedLibraries} // Librerías seleccionadas
        handleAuthorChange={handleAuthorChange}
        handleGenreChange={handleGenreChange}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        handleCloseModal={handleCloseModal}
        handleImageChange={handleImageChange}
        handleLibraryChange={handleLibraryChange}
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
