import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from "../components/Notification";
import { fetchData } from '../utils/fetch.js';
import Loading from '../components/Loading.jsx';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [error, setError] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [returnedFilter, setReturnedFilter] = useState('all');
  const [atBottom, setAtBottom] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [message, setMessage] = useState("");
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [cardSize, setCardSize] = useState(() => {
    return localStorage.getItem('cardSize') ? parseInt(localStorage.getItem('cardSize')) : 450;
  }); const token = localStorage.getItem('token');
  const navigate = useNavigate();



  useEffect(() => {
    if (!token) {
      setMessage("No token found, user might not be authenticated");
      setNotificationKey(prevKey => prevKey + 1);
      navigate('/login');
      return;
    }

    const fetchLoans = async () => {
      setLoading(true);
      setLoadingStartTime(Date.now());

      try {
        const data = await fetchData(`/getUserLoans?page=${page}&size=10`, 'GET', null, token);
        if (data.success) {
          setLoans(prevLoans => {
            const newLoans = data.message.filter(newLoan =>
              !prevLoans.some(prevLoan => prevLoan.book === newLoan.book)
            );
            return [...prevLoans, ...newLoans];
          });
          if (data.message.length === 0) {
            setMessage("No hay más libros por cargar.");
          }
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        setMessage(err.message);
      } finally {
        setAtBottom(false);
        setLoading(false);

        const elapsedTime = Date.now() - loadingStartTime;
        const minLoadingTime = 1000;
        const delay = Math.max(minLoadingTime - elapsedTime, 0);

        setLoadingVisible(true);
        setTimeout(() => {
          setLoadingVisible(false);
        }, delay);
      }
    };

    fetchLoans();
  }, [page, token, navigate]);

  useEffect(() => {
    localStorage.setItem('cardSize', cardSize);
  }, [cardSize]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...loans];

      if (startDateFilter) {
        const formattedStartDate = new Date(startDateFilter).toLocaleDateString();
        result = result.filter(loan =>
          new Date(loan.startDate).toLocaleDateString() === formattedStartDate
        );
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

      setFilteredLoans(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(result)) {
          return result;
        }
        return prev;
      });
    };

    applyFilters();
  }, [startDateFilter, authorFilter, returnedFilter, loans]);


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
    console.log(loans)

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
        setMessage(`El libro "${bookTitle}" ha sido devuelto con éxito.`);
      } else {
        setMessage(response.message);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setNotificationKey(prevKey => prevKey + 1);
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

  const calculateColumns = () => {
    const columns = Math.min(4, Math.max(1, Math.floor(12 / (cardSize / 100))));
    return `col-${Math.floor(12 / columns)}`;
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  }

  if (loadingVisible) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      {message && (
        <Notification key={notificationKey} message={message} />
      )}
      <h1 className="display-4 text-center mb-4">User Loans</h1>
      <div className="row w-100 justify-content-center">
        <div className="col-md-4">
          <div className="btn-group w-100" role="group" aria-label="Card size selector">
            <button
              type="button"
              className={`btn btn-outline-primary ${cardSize === 250 ? 'active' : ''}`}
              onClick={() => setCardSize(250)}
            >
              <i className="fas fa-square" style={{ fontSize: '8px' }}></i>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${cardSize === 350 ? 'active' : ''}`}
              onClick={() => setCardSize(350)}
            >
              <i className="fas fa-square" style={{ fontSize: '16px' }}></i>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${cardSize === 600 ? 'active' : ''}`}
              onClick={() => setCardSize(600)}
            >
              <i className="fas fa-square" style={{ fontSize: '32px' }}></i>
            </button>
          </div>
        </div>
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
              <div className="card mb-4" style={{ height: `${cardSize}px`, minWidth: `${cardSize}`, minHeight: `${cardSize}`, display: 'flex', flexDirection: 'column' }}>
                <div className="card-img-container"
                  style={{
                    flex: '1 0 40%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <img
                    src={`data:image/jpeg;base64,${loan.bookImage}`}
                    className="img-fluid"
                    alt={`Cover of ${loan.book}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
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

      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default UserLoans;
