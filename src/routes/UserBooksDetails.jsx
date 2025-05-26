import { useEffect, useState, Suspense, lazy } from "react";
import CardSizeSelector from "../components/CardSizeSelector.jsx";
import Loading from "../components/Loading.jsx";
const Loans = lazy(() => import("./Loans"));
const Reservations = lazy(() => import("./Reservations"));

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

  return (
    <main className="container text-center mt-5">
      <h1 className="mb-4" aria-label="Page title">
        What do you wanna see?
      </h1>

      <div className="btn-group" role="group" aria-label="View selection">
        <button
          type="button"
          className={`btn ${
            selectedButton === "Loans" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("Loans")}
          aria-label="Show loans"
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
          aria-label="Show reservations"
        >
          Reservations
        </button>
      </div>

      <div className="row w-100 justify-content-center mb-4">
        <CardSizeSelector cardSize={cardSize} setCardSize={setCardSize} />
      </div>

      <div>
        <Suspense fallback={<Loading />}>
          {selectedButton === "Loans" && <Loans cardSize={cardSize} />}
          {selectedButton === "Reservations" && (
            <Reservations cardSize={cardSize} />
          )}
        </Suspense>
      </div>
    </main>
  );
};

export default UserBooksDetails;
