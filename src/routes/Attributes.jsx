import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { jwtDecode } from "jwt-decode";
import "bootstrap-icons/font/bootstrap-icons.css";
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
    <main className="container text-center mt-5">
      <header className="mb-4">
        <h1>Select an attribute</h1>
      </header>

      <section className="btn-group mb-3" role="group">
        {["Genres", "Authors"].map((attr) => (
          <button
            key={attr}
            type="button"
            className={`btn ${selectedButton === attr ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleButtonClick(attr)}
          >
            {attr}
          </button>
        ))}
      </section>

      <section>
        {selectedButton === "Authors" && <Authors />}
        {selectedButton === "Genres" && <Genres />}
      </section>
    </main>
  );
}
