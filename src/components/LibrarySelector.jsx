import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch";
import { jwtDecode } from "jwt-decode";

const LibrarySelector = () => {
  const [libraries, setLibraries] = useState([]);
  const [token, setToken] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");

  useEffect(() => {
    const tokenStored = localStorage.getItem("token");
    setToken(tokenStored);

    if (tokenStored) {
      const decodedToken = jwtDecode(tokenStored);
      setSelectedLibrary(decodedToken.libraryId);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchLibraries = async () => {
      const data = await fetchData("/library/list", "GET", null, token);
      setLibraries(data);
    };
    fetchLibraries();
  }, [token]);

  const handleLibraryChange = async (e) => {
    const selectedLibraryId = e.target.value;
    const response = await fetchData(
      `/library/switch-library?id=${selectedLibraryId}`,
      "POST",
      null,
      token
    );

    if (response?.success) {
      const newToken = response.message;
      const libraryId = jwtDecode(newToken).libraryId;
      localStorage.setItem("token", newToken);
      localStorage.setItem("libraryId", libraryId);
      setToken(newToken);
      setSelectedLibrary(libraryId);
    }
  };

  return (
    <div>
      <select
        className="form-select bg-dark text-light"
        value={selectedLibrary}
        onChange={handleLibraryChange}
      >
        <option key="default" value="" disabled>
          Select a library
        </option>
        {libraries.map((library) => (
          <option key={library.id} value={library.id}>
            {library.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LibrarySelector;
