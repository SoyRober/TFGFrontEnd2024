import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import RenameAttributeModal from "../components/RenameAttributeModal";

const GenresComponent = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
  const [token] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchData(`/getGenres`, "GET", null, token);
        console.log("🚀 ~ fetchGenres ~ data:", data);
        setGenres(data);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchGenres();
  }, [token]);

  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    setShowModal(true);
  };

  const handleRenameGenre = async (id, newName) => {
    console.log("🚀 ~ handleRenameGenre");
    console.log("🚀 ~ newName: ", newName);
    console.log("🚀 ~ id: ", id);
    try {
      const response = await fetchData(
        `/editGenre`,
        "POST",
        { id, newName },
        token
      );
      setMessage(response.message);
      setShowModal(false);
      // Refresh genres list
      const data = await fetchData(`/getGenres`, "GET", null, token);
      setGenres(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      {message && <Notification message={message} />}

      <div className="row">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <div key={genre.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{genre.name}</h5>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEditGenre(genre)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No genres available</p>
        )}
      </div>
      {selectedGenre && (
        <RenameAttributeModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleRename={handleRenameGenre}
          attribute={selectedGenre}
        />
      )}
    </div>
  );
};

export default GenresComponent;
