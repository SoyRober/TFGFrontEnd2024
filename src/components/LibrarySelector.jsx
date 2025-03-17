import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch";

const LibrarySelector = () => {
  const [libraries, setLibraries] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenStored = localStorage.getItem("token");
    setToken(tokenStored);
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
      localStorage.setItem("token", response.message);
      setToken(response.message);
    }
  };

  return (
    <div>
      <select
        className="form-select bg-dark text-light"
        defaultValue=""
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
