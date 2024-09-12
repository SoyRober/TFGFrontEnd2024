import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { fetchData } from '../utils/fetch.js';
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ViewProfile = () => {
    const [userData, setUserData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { email } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
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
            const token = localStorage.getItem('token');
            if (!token) navigate("/");
            try {
                const data = await fetchData(`/getUserProfile/${email}`, 'GET', null, token);
                console.log(data);
                setUserData(data);  
            } catch (error) {
                setErrorMessage("Error loading user profile");
            }
        };

        fetchUserProfile();
    }, [email, navigate]);

    const handleReturnBook = async (bookTitle, email) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetchData('/return', 'PUT', {title: bookTitle, user: email} , token);
            console.log(response)
            if (response) {
                setMessage(`The book "${bookTitle}" has been returned successfully.`);
                setUserData(prevData => ({
                    ...prevData,
                    loanList: prevData.loanList.map(loan => 
                        loan.book === bookTitle ? { ...loan, isReturned: true } : loan
                    )
                }));
            } else {
                setMessage(response.message || 'Error al devolver el libro.');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="container">
            <h2>User Profile</h2>
            {errorMessage && <Notification message={errorMessage} type="error" />}
            {message && <Notification message={message} type="success" />}
            <div className="user-details">
                <p><strong>Username:</strong> {userData?.username || 'N/A'}</p>
                <p><strong>Email:</strong> {userData?.email || 'N/A'}</p>
                <p><strong>Birth Date:</strong> {userData?.birthDate || 'N/A'}</p>
                <p><strong>Role:</strong> {typeof userData?.role === 'string' ? userData.role.toLowerCase() : 'N/A'}</p>

                <div className="user-reservations">
                    <h3>Reservations</h3>
                    {userData?.reservationList?.length > 0 ? (
                        <ul>
                            {userData.reservationList.map((reservation, index) => (
                                <li key={index}>Reservation {index + 1}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reservations found.</p>
                    )}
                </div>

                <div className="user-loans">
                    <h3>Loans</h3>
                    {userData?.loanList?.length > 0 ? (
                        <ul>
                            {userData.loanList.map((loan, index) => (
                                <li key={index}>
                                    {loan.book} 
                                    {!loan.isReturned && (
                                        <button 
                                            className="btn btn-primary ms-2"
                                            onClick={() => handleReturnBook(loan.book, userData.email)}
                                        >
                                            Return
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No loans found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;