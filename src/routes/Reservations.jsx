import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetch";
import { Link, useNavigate } from 'react-router-dom';
import Notification from "../components/Notification";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationsComponent = () => {
  const navigate = useNavigate();
  const [page] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [atBottom, setAtBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });
  const [cardSize, setCardSize] = useState(() => {
    return localStorage.getItem('cardSize') ? parseInt(localStorage.getItem('cardSize')) : 450;
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await fetchData(`/getUserReservations?page=${page}&size=10`, 'GET', null, token);
        if (data.success) {
          setReservations(prevReservations => {
            const newReservations = data.message.filter(newReservation =>
              !prevReservations.some(prevReservation => prevReservation.bookTitle === newReservation.bookTitle)
            );
            return [...prevReservations, ...newReservations];
          });
          if (data.message.length === 0) {
            setMessage("No hay más reservas por cargar.");
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
    fetchReservations();
  }, [page, token, navigate]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...reservations];

      if (startDateFilter) {
        const formattedStartDate = new Date(startDateFilter).toLocaleDateString();
        result = result.filter(reservation =>
          new Date(reservation.reservationDate).toLocaleDateString() === formattedStartDate
        );
      }

      setFilteredReservations(result);
    };

    applyFilters();
  }, [startDateFilter, reservations]);

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

  const calculateColumns = () => {
    const columns = Math.min(4, Math.max(1, Math.floor(12 / (cardSize / 100))));
    return `col-${Math.floor(12 / columns)}`;
  };

  const resetStartDateFilter = () => setStartDateFilter('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterBooks(e.target.value);
  };

  const filterBooks = (term) => {
    if (!term) {
      setFilteredReservations(reservations);
    } else {

      const lowerCaseTerm = term.toLowerCase();
      const filtered = reservations.filter(reservations =>
        reservations.bookTitle.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredReservations(filtered);
    }
  };
  
  return (
    <div className="row">
      {message && (
        <Notification key={notificationKey} message={message} />
      )}
      <div className="mb-3">
        <label htmlFor="startDateFilter" className="form-label">Start Date Filter</label>
        <div className="d-flex">
          <DatePicker
            selected={startDateFilter}
            onChange={(date) => setStartDateFilter(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            id="startDateFilter"
          />
          <button className="btn btn-secondary ms-2" onClick={resetStartDateFilter}>Reset</button>
        </div>
      </div>

      <div className="row w-100 justify-content-center mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        filteredReservations.map((reservation, index) => (
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
                  src={`data:image/jpeg;base64,${reservation.bookImage}`}
                  className="img-fluid"
                  alt={`Cover of ${reservation.bookTitle}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="card-body" style={{ flex: '1 0 40%', overflowY: 'auto' }}>
                <h5 className="card-title">
                  <Link to={`/viewBook/${reservation.bookTitle}`} className="text-decoration-none d-flex align-items-center">
                    {reservation.bookTitle}
                    <i className="fas fa-mouse-pointer ms-2" title="Click to view details"></i>
                  </Link>
                </h5>
                <p className="card-text">
                  <strong>Reservation Date:</strong> {new Date(reservation.reservationDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
                <p className="card-text">
                  <strong>Loaned:</strong> {reservation.isLoaned ? 'Yes' : 'No'}
                </p>
                <p className="card-text">
                  <strong>Available:</strong> {reservation.isAvailable ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No reservations found</p>
      )}
    </div>
  );
};

export default ReservationsComponent;