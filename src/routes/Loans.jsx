import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
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
        const response = await fetch('http://localhost:8080/getUserLoans', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
          }
        }

        const data = await response.json();
        console.log(data)
        if (data.success) {
          setLoans(data.message);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLoans();
  }, [token, navigate]);

  if (error) {
    return <div className="alert alert-danger" role="alert">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-4">User Loans</h1>
      <div className="row">
        {loans.length > 0 ? (
          loans.map((loan, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={`data:image/jpeg;base64,${loan.bookImage}`}
                  className="card-img-top"
                  alt={`Cover of ${loan.book}`}
                />
                <div className="card-body">
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
