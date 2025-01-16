import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { fetchData } from "../utils/fetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ViewProfile = () => {
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "USER") {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      try {
        const data = await fetchData(
          `/getUserProfile/${email}`,
          "GET",
          null,
          token
        );
        console.log(data);
        setUserData(data);
      } catch (error) {
        setErrorMessage("Error loading user profile");
      }
    };

    fetchUserProfile();
  }, [email, navigate]);

  const handleReturnBook = async (bookTitle, email) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetchData(
        "/return",
        "PUT",
        { title: bookTitle, user: email },
        token
      );
      console.log(response);
      if (response) {
        setMessage(`The book "${bookTitle}" has been returned successfully.`);
        setUserData((prevData) => ({
          ...prevData,
          loanList: prevData.loanList.map((loan) =>
            loan.book === bookTitle ? { ...loan, isReturned: true } : loan
          ),
        }));
      } else {
        setMessage(response.message || "Error al devolver el libro.");
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <main className="container my-5">
      {errorMessage && <Notification message={errorMessage} type="error" />}
      {message && <Notification message={message} type="success" />}

      <section className="card p-4 mb-4 shadow">
        <div className="card-body">
          <p>
            <strong>Username:</strong> {userData?.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email || "N/A"}
          </p>
          <p>
            <strong>Birth Date:</strong> {userData?.birthDate || "N/A"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            {typeof userData?.role === "string"
              ? userData.role.toLowerCase()
              : "N/A"}
          </p>
        </div>
      </section>

      <section className="card p-4 mb-4 shadow">
        <div className="card-body">
          <h3 className="mb-3">Reservations</h3>
          {userData?.reservationList?.length > 0 ? (
            <div className="row">
              {userData.reservationList.map((reservation, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <i className="bi bi-calendar-check me-2"></i>
                      Reservation {index + 1}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No reservations found.</p>
          )}
        </div>
      </section>

      <section className="card p-4 shadow">
        <div className="card-body">
          <h3 className="mb-3">Loans</h3>
          {userData?.loanList?.length > 0 ? (
            <div className="row">
              {userData.loanList.map((loan, index) => (
                <article key={index} className="col-md-6 mb-3">
                  <div className="card shadow-sm d-flex justify-content-between align-items-center p-2">
                    <div>
                      <i className="bi bi-book me-2"></i>
                      {loan.book}
                    </div>
                    {!loan.isReturned && (
                      <button
                        className="btn btn-primary btn-sm ms-2 my-2"
                        onClick={() =>
                          handleReturnBook(loan.book, userData.email)
                        }
                      >
                        Return
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No loans found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ViewProfile;
