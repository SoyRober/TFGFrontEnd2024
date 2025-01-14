import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { jwtDecode } from "jwt-decode";
import "bootstrap-icons/font/bootstrap-icons.css";
import Genres from "./Genres.jsx";

export default function Attributes() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(() => {
    return localStorage.getItem("attribute")
      ? localStorage.getItem("attribute")
      : "";
  });
  const handleButtonClick = (button) => {
    setSelectedButton(button);
    localStorage.setItem("attribute", button);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      if (userRole === "ADMIN" || userRole === "LIBRARIAN") {
        setHasPermissions(true);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  if (!hasPermissions) {
    return <h1>UnAuthorized</h1>;
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">
        {selectedButton === "Authors"
          ? "Authors"
          : selectedButton === "Genres"
          ? "Genres"
          : "Attributes"}
      </h1>

      <div className="btn-group" role="group">
        <button
          type="button"
          className={`btn ${
            selectedButton === "Genres" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("Genres")}
        >
          Genres
        </button>

        <button
          type="button"
          className={`btn ${
            selectedButton === "Authors" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleButtonClick("Authors")}
        >
          Authors
        </button>
      </div>
      {selectedButton === "Authors" && <p>Authors</p>}
      {selectedButton === "Genres" && <Genres />}
    </div>
  );
}
