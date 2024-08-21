import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { fetchData } from '../utils/fetch.js';
import { jwtDecode } from 'jwt-decode'

export default function ViewBook() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [reviewData, setReviewData] = useState({ score: '', comment: '' });
  const [hover, setHover] = useState(0);
  const [newImage, setNewImage] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loanStatus, setLoanStatus] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [currentUserScore, setCurrentUserScore] = useState('');
  const [currentUserComment, setCurrentUserComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
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
        const data = await fetchData(`/getBookByTitle?title=${encodeURIComponent(title)}`);
        setBook(data.book);
        setImageSrc(data.image ? `data:image/jpeg;base64,${data.image}` : '');
        setSelectedAuthors(data.book.authors || []);
        setSelectedGenres(data.book.genres || []);
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await fetchData(`/getReviewsByBookTitle?title=${encodeURIComponent(title)}`);
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const url = "http://localhost:8080/searchAuthors";
        const bodyContent = '';

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: bodyContent
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
        setAuthors([]);
      }
    };

    const fetchGenres = async () => {
      try {
        const url = "http://localhost:8080/searchGenres";
        const bodyContent = '';

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: bodyContent
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
    };

    //TODO if this userId has Review with this bookId 
    const fetchExistingReview = async () => {
      try {
        console.log("1"); //Executed
        const token = localStorage.getItem('token');
        console.log("token " + token);
        const data = await fetchData(`/getReview?title=${encodeURIComponent(title)}`, 'GET', null, token); //?

        console.log("2"); //Not Executed
        if(data.success == true){
          setAlreadyRated(true);
          setCurrentUserScore(data.review.score); 
          setCurrentUserComment(data.review.comment);
          console.log("3");
        } else { 
          console.log("No Current review");
        }
      } catch (error) {
        console.error("Failed to fetch Existing Review:", error);
      }    
    } 

    fetchBookData();
    fetchReviews();
    fetchAuthors();
    fetchGenres();
    checkLoanStatus(); 
    fetchExistingReview();
  }, [title]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log("token: " + token);
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData('/addReview', 'POST', {
        title,
        score: reviewData.score,
        comment: reviewData.comment
      }, token);

      const reviewsData = await fetchData(`/getReviewsByBookTitle?title=${encodeURIComponent(title)}`);
      setReviews(reviewsData);
      setReviewData({ score: '', comment: '' });

    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleEditClick = (attribute) => {
    setEditingAttribute(attribute);
    setEditValue(book[attribute]);
    if (attribute === 'authors') {
      setSelectedAuthors(book.authors || []);
    } else if (attribute === 'genres') {
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    const payload = new FormData();
    payload.append('title', title);
    console.log("title " + title);
    payload.append('attribute', editingAttribute);
    if (editingAttribute === 'authors') {
      payload.append('value', JSON.stringify(selectedAuthors));
    } else if (editingAttribute === 'genres') {
      payload.append('value', JSON.stringify(selectedGenres));
    } else if (editingAttribute === 'isAdult') {
        // Aquí convertimos el valor a booleano si es 'isAdult'
        const booleanValue = editValue === 'true';
        payload.append('value', booleanValue);
    } else {
      payload.append('value', editValue);
    }

    if (newImage) {
      payload.append('image', newImage);
    }

    try {
      const updatedBook = await fetchData('/updateBook', 'POST', payload, token);
      setBook(updatedBook);
      setEditingAttribute(null);

      if (editingAttribute === 'title') {
        navigate(`/viewBook/${editValue}`);
      } else {
        location.reload();
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleCloseModal = () => {
    setEditingAttribute(null);
  };

  const renderEditModal = () => {
    if (!editingAttribute) return null;

    let inputField;

    switch (editingAttribute) {
      case 'authors':
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
      case 'genres':
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
      case 'quantity':
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
      case 'isAdult':
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
      case 'publicationDate':
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
      case 'image':
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
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="editValue">New Value</label>
                  {inputField}
                </div>
                <button type="submit" className="btn btn-primary mt-3">Save changes</button>
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

  const checkLoanStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }
  
    try {
      const response = await fetchData('/isLoaned', 'POST', title, token, 'plain/text');
      if (response === false) {
        console.error("Failed to check loan status:", response.message);
        return;
      }
      setLoanStatus(response); 
    } catch (error) {
      console.error("Failed to check loan status:", error);
    }
  };  

  const handleDeleteBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }

    try {
      await fetchData(`/deleteBook?title=${encodeURIComponent(title)}`, 'DELETE', null, true);
      setShowDeleteConfirmation(false);
      navigate('/');
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleLoanClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, user might not be authenticated");
      return;
    }
  
    try {
      if (loanStatus) {
        await fetchData('/return', 'PUT', title, token, 'text/plain');
        setLoanStatus(false); 
      } else {
        await fetchData('/loan', 'POST', title , token, 'text/plain'); 
        setLoanStatus(true); 
      }
    } catch (error) {
      alert(`Error trying to loan the book`);
      console.error("Failed to update loan status:", error);
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
      <h1 className="display-4 text-center mb-4">{book.title}</h1>
      <div className="row">
        <div>
        {isLoggedIn && (
          <>
            <button
              onClick={handleLoanClick}
              className={`btn ${loanStatus ? 'btn-danger' : 'btn-primary'}`}
            >
              {loanStatus ? 'Return' : 'Loan'}
            </button>
            {hasPermissions && (
              <button onClick={() => setShowDeleteConfirmation(true)} className="btn btn-danger ml-2">
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
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('image')} className="btn btn-primary">Edit image</button>}
        </div>
        <div className="col-md-6 mb-3">
          <p><span className="label">Title:</span> {book.title}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('title')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Authors:</span> {book.authors ? book.authors.join(', ') : 'N/A'}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('authors')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Genres:</span> {book.genres ? book.genres.join(', ') : 'N/A'}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('genres')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Quantity:</span> {book.quantity}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('quantity')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Location:</span> {book.location}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('location')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Synopsis:</span> {book.synopsis}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('synopsis')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Publication Date:</span> {book.publicationDate}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('publicationDate')} className="btn btn-primary">Edit</button>}

          <p><span className="label">Adult:</span> {book.adult ? 'Yes' : 'No'}</p>
          {isLoggedIn && hasPermissions && <button onClick={() => handleEditClick('isAdult')} className="btn btn-primary">Edit</button>}
        </div>
      </div>

      {isLoggedIn && ( //TODO !already reviewed
        <form onSubmit={handleReviewSubmit} className="mb-5">
          <div className="form-group">
            <label>Score:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= (hover || reviewData.score) ? 'on' : 'off'}
                  onClick={() => setReviewData(prevData => ({ ...prevData, score: star }))}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(reviewData.score)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', color: star <= (hover || reviewData.score) ? 'gold' : 'grey' }}
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
          <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
        </form>
      )}

      <h2 className="mt-5">Reviews</h2>
      <div className="list-group mb-3">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="list-group-item">
              <p><strong>User:</strong> {review.userName}</p>
              <p><strong>Score:</strong> {review.score}</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>

      {renderEditModal()}

      {/* Ventana de confirmación para eliminar libro */}
      {showDeleteConfirmation && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirmation(false)}></button>
              </div>
              <div className="modal-body">
                <p>This book will be deleted. Are you sure?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteBook}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
