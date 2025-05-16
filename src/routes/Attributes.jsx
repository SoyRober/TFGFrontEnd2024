import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Genres from "./Genres.jsx";
import Authors from "./Authors.jsx";

export default function Attributes() {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(localStorage.getItem("attribute") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    try {
      if (jwtDecode(token).role.toLowerCase() === "user") navigate("/");
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    localStorage.setItem("attribute", button);
  };

  return (
    <main className="container text-center mt-5" aria-label="Attributes Page">
      <header className="mb-4">
        <h1 aria-label="Select an Attribute Title">Select an attribute</h1>
      </header>

      <section className="btn-group mb-3" role="group" aria-label="Attribute Selection Buttons">
        {["Genres", "Authors"].map((attr) => (
          <button
            key={attr}
            type="button"
            className={`btn ${selectedButton === attr ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleButtonClick(attr)}
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
