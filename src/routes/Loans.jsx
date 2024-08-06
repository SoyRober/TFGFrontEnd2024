import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/loading.css';
import { fetchData } from '../utils/fetch.js';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [error, setError] = useState(null);
  const [cardHeight, setCardHeight] = useState(400);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [returnedFilter, setReturnedFilter] = useState('all');
  const [atBottom, setAtBottom] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch loans based on page number
  useEffect(() => {
    if (!token) {
      setError("No token found, user might not be authenticated");
      navigate('/login');
      return;
    }

    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await fetchData(`/getUserLoans?page=${page}&size=10`, 'GET', null, token);
        if (data.success) {
          setLoans(prevLoans => [...prevLoans, ...data.message]);
        } else {
          if (data.message.includes("rows")) {
            console.log("No más que cargar");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setAtBottom(false);
        setLoading(false);
      }
    };

    fetchLoans();
  }, [page, token, navigate]);

  // Apply filters
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

  // Scroll handling to load more loans
  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop + windowHeight >= documentHeight - 5) {
        if (!atBottom && !loading) {
          setAtBottom(true);
          setPage(prevPage => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [atBottom, loading]);

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

  const resetStartDateFilter = () => setStartDateFilter('');
  const resetAuthorFilter = () => setAuthorFilter('');
  const resetReturnedFilter = () => setReturnedFilter('all');

  const resetAllFilters = () => {
    setStartDateFilter('');
    setAuthorFilter('');
    setReturnedFilter('all');
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  }

  if (loans.length === 0 && !loading) {
    return (
      <div className={`modal-book fade-in`}>
        <span className="page left"></span>
        <span className="middle"></span>
        <span className="page right"></span>
      </div>
    );
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
        <div className="d-flex">
          <input
            type="date"
            id="startDateFilter"
            className="form-control"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
          <button className="btn btn-secondary ms-2" onClick={resetStartDateFilter}>Reset</button>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="authorFilter" className="form-label">Author Filter</label>
        <div className="d-flex">
          <input
            type="text"
            id="authorFilter"
            className="form-control"
            placeholder="Enter author name or surname"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
          <button className="btn btn-secondary ms-2" onClick={resetAuthorFilter}>Reset</button>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="returnedFilter" className="form-label">Returned Filter</label>
        <div className="d-flex">
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
          <button className="btn btn-secondary ms-2" onClick={resetReturnedFilter}>Reset</button>
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-warning" onClick={resetAllFilters}>Reset All Filters</button>
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
                    {!loan.isReturned && (
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => handleReturnBook(loan.book)}
                      >
                        Return
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info" role="alert">No loans found</div>
        )}
      </div>
    </div>
  );
};

export default UserLoans;
