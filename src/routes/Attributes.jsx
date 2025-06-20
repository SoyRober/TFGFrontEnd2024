import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Genres from "./Genres.jsx";
import Authors from "./Authors.jsx";
import { hasAuthorization } from "../utils/auth.js";

export default function Attributes() {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(localStorage.getItem("attribute") || "");

  useEffect(() => {
    if (!hasAuthorization(["librarian", "admin"])) navigate("/");
  }, [navigate]);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    localStorage.setItem("attribute", button);
  };

  return (
    <main className="container text-center mt-5" aria-label="Attributes Page">
      <header className="mb-4">
        <h1>Select an attribute</h1>
      </header>

      <section className="btn-group mb-3" role="group" aria-label="Attribute Selection Buttons">
        {["Genres", "Authors"].map((attr) => (
          <button
            key={attr}
            type="button"
            className={`btn ${selectedButton === attr ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleButtonClick(attr)}
            aria-pressed={selectedButton === attr}
            aria-label={`Select ${attr} Button`}
          >
            {attr}
          </button>
        ))}
      </section>

      <section aria-label="Selected Attribute Section">
        {selectedButton === "Authors" && <Authors />}
        {selectedButton === "Genres" && <Genres />}
      </section>
    </main>
  );
}
