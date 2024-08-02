import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchData } from '../utils/fetch.js';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [error, setError] = useState(null);
  const [cardHeight, setCardHeight] = useState(400); 
  const [startDateFilter, setStartDateFilter] = useState(''); 
  const [authorFilter, setAuthorFilter] = useState(''); 
  const [returnedFilter, setReturnedFilter] = useState('all'); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLoans = async () => {
      if (!token) {
        setError("No token found, user might not be authenticated");
        navigate('/login');
        return;
      }

      try {
        const data = await fetchData('/getUserLoans', 'GET', null, token);
        if (data.success) {
          setLoans(data.message);
          setFilteredLoans(data.message); 
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLoans();
  }, [token, navigate]);

  useEffect(() => {
    const applyFilters = () => {
      let result = loans;

      if (startDateFilter) {
        const formattedStartDate = new Date(startDateFilter).toLocaleDateString();
        result = result.filter(loan => new Date(loan.startDate).toLocaleDateString() === formattedStartDate);
      }

      if (authorFilter) {
        result = result.filter(loan =>
          loan.author && loan.author.some(author =>
            (author.name && author.name.toLowerCase().includes(authorFilter.toLowerCase())) ||
            (author.surname && author.surname.toLowerCase().includes(authorFilter.toLowerCase()))
          )
        );
      }

      if (returnedFilter !== 'all') {
        const isReturned = returnedFilter === 'returned';
        result = result.filter(loan => loan.isReturned === isReturned);
      }

      setFilteredLoans(result);
    };

    applyFilters();
  }, [startDateFilter, authorFilter, returnedFilter, loans]);

  const handleReturnBook = async (bookTitle) => {
    try {
      const response = await fetchData('/return', 'PUT', bookTitle, token, 'text/plain');
      if (response) {
        setLoans(prevLoans => 
          prevLoans.map(loan => loan.book === bookTitle ? { ...loan, isReturned: true } : loan)
        );
        setFilteredLoans(prevLoans => 
          prevLoans.map(loan => loan.book === bookTitle ? { ...loan, isReturned: true } : loan)
        );
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };  

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  }

  const calculateColumns = () => {
    const columns = Math.min(4, Math.max(1, Math.floor(12 / (cardHeight / 100))));
    return `col-${Math.floor(12 / columns)}`;
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">User Loans</h1>
      
      <div className="mb-3">
        <label htmlFor="cardHeightRange" className="form-label">Card Height</label>
        <input
          type="range"
          className="form-range"
          id="cardHeightRange"
          min="300"
          max="600"
          value={cardHeight}
          onChange={(e) => setCardHeight(e.target.value)}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="startDateFilter" className="form-label">Start Date Filter</label>
        <input
          type="date"
          id="startDateFilter"
          className="form-control"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="authorFilter" className="form-label">Author Filter</label>
        <input
          type="text"
          id="authorFilter"
          className="form-control"
          placeholder="Enter author name or surname"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="returnedFilter" className="form-label">Returned Filter</label>
        <select
          id="returnedFilter"
          className="form-select"
          value={returnedFilter}
          onChange={(e) => setReturnedFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="returned">Returned</option>
          <option value="notReturned">Not Returned</option>
        </select>
      </div>
      
      <div className="row">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <div key={index} className={calculateColumns()}>
              <div className="card mb-4" style={{ height: `${cardHeight}px`, display: 'flex', flexDirection: 'column' }}>
                <div className="card-img-container" style={{ flex: '1 0 60%' }}>
                  <img
                    src={`data:image/jpeg;base64,${loan.bookImage}`}
                    className="card-img-top"
                    alt={`Cover of ${loan.book}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card-body" style={{ flex: '1 0 40%', overflowY: 'auto' }}>
                  <h5 className="card-title">
                    <Link to={`/viewBook/${loan.book}`} className="text-decoration-none d-flex align-items-center">
                      {loan.book}
                      <i className="fas fa-mouse-pointer ms-2" title="Click to view details"></i>
                    </Link>
                  </h5>
                  <p className="card-text">
                    <strong>Start Date:</strong> {new Date(loan.startDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Return Date:</strong> {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="card-text">
                    <strong>Authors:</strong> {loan.author.map((author, i) => (
                      <span key={i}>{author.name} {author.surname}{i < loan.author.length - 1 ? ', ' : ''}</span>
                    ))}
                  </p>
                  <p className="card-text">
                    <strong>Returned:</strong> {loan.isReturned ? 'Yes' : 'No'}
                    {!loan.isReturned && 
                      <button 
                        className="btn btn-warning ms-2"
                        onClick={() => handleReturnBook(loan.book)}
                      >
                        Return
                      </button>
                    }
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info" role="alert">No loans found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLoans;
