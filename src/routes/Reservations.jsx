import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetch";

const ReservationsComponent = () => {
    const [page] = useState(0);
    const [cardSize, setCardSize] = useState(() => {
        return localStorage.getItem('cardSize') ? parseInt(localStorage.getItem('cardSize')) : 450;
    });
    const [reservations, setReservations] = useState(null);
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") ? localStorage.getItem("token") : null;
    });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                if (!token) {
                    console.error("No token available");
                    return;
                }

                const response = await fetchData(`/getUserReservations?page=${page}&size=10`, 'GET', null, token);

                setReservations(response.message);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReservations();
    }, [token, page]); 

    return (
        <div>
            <p>Pollita</p>
            {reservations && reservations.map(reservation => (
                <div>
                    <p>{reservation.name}</p>
                </div>
            ))}
        </div>
    );
};

export default ReservationsComponent;
