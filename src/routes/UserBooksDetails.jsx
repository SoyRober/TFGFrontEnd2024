import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Loans from "./Loans.jsx";
import Reservations from "./Reservations.jsx";

const UserBooksDetails = () => {
  const [selectedButton, setSelectedButton] = useState(() => {
    return localStorage.getItem("userBookDetails")
      ? localStorage.getItem("userBookDetails")
      : "";
  });
  const [cardSize, setCardSize] = useState(() => {
    return localStorage.getItem("cardSize")
      ? localStorage.getItem("cardSize")
      : "medium";
  });
  const handleButtonClick = (button) => {
    setSelectedButton(button);
    localStorage.setItem("userBookDetails", button);
  };

  useEffect(() => {
    setCardSize(cardSize);
  }, [cardSize]);

  useEffect(() => {
    localStorage.setItem("cardSize", cardSize);
  }, [cardSize]);

  const getColumnClass = (cardSize) => {
    localStorage.setItem("cardSize", cardSize);
    switch (cardSize) {
      case "small":
        return "col-12 col-sm-6 col-md-4 col-lg-3";
      case "medium":
        return "col-12 col-sm-6 col-md-6 col-lg-4";
      case "large":
        return "col-12 col-md-6";
      default:
        return "col-12";
    }
  };

  return (
    <main className="container text-center mt-5">
      <h1 className="mb-4">What do you wanna see?</h1>

      <div className="btn-group" role="group">
        <button
          type="button"
          className={`btn ${
            selectedButton === "Loans" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("Loans")}
        >
          Loans
        </button>

        <button
          type="button"
          className={`btn ${
            selectedButton === "Reservations"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("Reservations")}
        >
          Reservations
        </button>
      </div>

      <div className="row w-100 justify-content-center mb-4">
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center mt-4">
          <div
            className="btn-group w-100"
            role="group"
            aria-label="Card size selector"
          >
            <button
              type="button"
              className={`btn btn-outline-primary ${
                cardSize === "small" ? "active" : ""
              }`}
              onClick={() => setCardSize("small")}
            >
              Pequeño
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                cardSize === "medium" ? "active" : ""
              }`}
              onClick={() => setCardSize("medium")}
            >
              Mediano
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                cardSize === "large" ? "active" : ""
              }`}
              onClick={() => setCardSize("large")}
            >
              Grande
            </button>
          </div>
        </div>
      </div>

      {selectedButton === "Loans" && <Loans cardSize={cardSize} />}
      {selectedButton === "Reservations" && (
        <Reservations cardSize={cardSize} />
      )}
    </main>
  );
};

export default UserBooksDetails;
