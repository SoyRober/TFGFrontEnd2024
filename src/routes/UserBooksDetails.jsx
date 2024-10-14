import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loans from "./Loans.jsx";
import Reservations from "./Reservations.jsx"

const UserBooksDetails = () => {
    const [selectedButton, setSelectedButton] = useState('');
    const [cardSize, setCardSize] = useState(() => {
        return localStorage.getItem('cardSize') ? parseInt(localStorage.getItem('cardSize')) : 450;
    });
    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    useEffect(() => {
        console.log("🚀 ~ UserBooksDetails ~ selectedButton:", selectedButton)

    }, [selectedButton])

    return (
        <div className="container text-center mt-5">
            <h1>What do you wanna see?</h1>

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

            <div className="row w-100 justify-content-center mt-4">
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

            {selectedButton === 'Loans' && <Loans cardSize={cardSize}/>}
            {selectedButton === 'Reservations' && <Reservations cardSize={cardSize}/>}
        </div>
    );
}

export default UserBooksDetails;
