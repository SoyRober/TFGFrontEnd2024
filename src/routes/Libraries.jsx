import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

export default function Libraries() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData("/libraries/detailedList", "GET");
      setLibraries(data);
    } catch (err) {
      setError(err.message || "Failed to fetch libraries");
      toast.error(err.message || "Failed to fetch libraries");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading libraries...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Libraries</h1>
      {libraries.length === 0 ? (
        <p>No libraries available.</p>
      ) : (
        <ul className="list-group">
          {libraries.map((library) => (
            <li
              key={library.id}
              className="list-group-item d-flex align-items-center flex-wrap"
              style={{ padding: "10px" }}
            >
              <div className="col-md-4">
                <strong>Name:</strong> {library.name}
              </div>
              <div className="col-md-4">
                <strong>Address:</strong> {library.address}
              </div>
              <div className="col-md-4 text-end d-flex justify-content-between">
                <Button
                  variant="warning"
                  size="sm"
                  className="me-1"
                  onClick={console.log(library.id)}
                >
                  Change Address
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="primary"
        className="mt-3"
        style={{ position: "absolute", bottom: "20px", left: "20px" }}
      >
        Add New Library
      </Button>
    </div>
  );
}
