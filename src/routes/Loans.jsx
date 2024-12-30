import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from "../components/Notification";
import { fetchData } from '../utils/fetch.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserLoans = ({ cardSize }) => {
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
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("No token found, user might not be authenticated");
      setNotificationKey(prevKey => prevKey + 1);
      navigate('/login');
      return;
    }

    const fetchLoans = async () => {
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      {message && (
        <Notification key={notificationKey} message={message} />
      )}

<div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mb-3">
  <div className="d-flex align-items-center">
    <label htmlFor="startDateFilter" className="me-2">Date:</label>
    <DatePicker
      selected={startDateFilter}
      onChange={(date) => setStartDateFilter(date)}
      className="form-control form-control"
      dateFormat="dd/MM/yyyy"
      placeholderText="Select a date"
      id="startDateFilter"
    />
    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={resetStartDateFilter}>⟲</button>
  </div>

  <div className="d-flex align-items-center">
    <label htmlFor="authorFilter" className="me-2">Author:</label>
    <input
      type="text"
      id="authorFilter"
      className="form-control form-control"
      placeholder="Name or surname"
      value={authorFilter}
      onChange={(e) => setAuthorFilter(e.target.value)}
    />
    <button className="btn btn-outline-secondary btn-sm ms-2" onClick={resetAuthorFilter}>⟲</button>
  </div>

  <div className="d-flex align-items-center">
    <label htmlFor="returnedFilter" className="me-2">Status:</label>
    <select
      id="returnedFilter"
      className="form-select form-select"
      value={returnedFilter}
      onChange={(e) => setReturnedFilter(e.target.value)}
    >
      <option value="all">All</option>
      <option value="returned">Returned</option>
      <option value="notReturned">Not Returned</option>
    </select>
    <button className="btn btn-outline-secondary btn ms-2" onClick={resetReturnedFilter}>⟲</button>
  </div>

  <button className="btn btn-warning btn" onClick={resetAllFilters}>Reset Filters</button>
</div>


      <div className="row">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <div key={index} className={calculateColumns()}>
              <div className="card mb-4 d-flex flex-column" style={{ height: `${cardSize}px`, minWidth: `${cardSize}`, minHeight: `${cardSize}` }}>
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
                    <strong>Start Date:</strong> {new Date(loan.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="card-text">
                    <strong>Return Date:</strong> {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
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