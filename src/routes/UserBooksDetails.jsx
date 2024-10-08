import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loans from "./Loans.jsx";
import Reservations from "./Reservations.jsx"

const UserBooksDetails = () => {
    const [selectedButton, setSelectedButton] = useState('');
    
    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    useEffect(() => {
        console.log("🚀 ~ UserBooksDetails ~ selectedButton:", selectedButton)
        
  }, [selectedButton])

    return (
        <div className="container text-center mt-5">
            <h1>Select an Option</h1>

            <div className="btn-group" role="group">
                <button
                    type="button"
                    className={`btn ${selectedButton === 'Loans' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleButtonClick('Loans')}
                >
                    Loans
                </button>

                <button
                    type="button"
                    className={`btn ${selectedButton === 'Reservations' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleButtonClick('Reservations')}
                >
                    Reservations
                </button>
            </div>

            <p className="mt-3">Selected Option: {selectedButton}</p>

            {selectedButton === 'Loans' && <Loans />}
            {selectedButton === 'Reservations' && <Reservations />}
        </div>
    );
}

export default UserBooksDetails;
