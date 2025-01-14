import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { fetchData } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const GenresComponent = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState("");
  const [token] = useState(() => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : null;
  });

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

  return (
    <div className="container">
      {message && <Notification message={message} />}

      <div className="row">
        {genres.length > 0 ? (
          genres.map((genre, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={index}>
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span>{genre.name}</span>
                  <div>
                    <button className="btn btn-outline-primary btn-sm me-2">
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
    </div>
  );
};

export default GenresComponent;
