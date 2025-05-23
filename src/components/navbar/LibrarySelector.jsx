import { useState, useEffect } from "react";
import { fetchData } from "../../utils/fetch";
import { useNavigate } from "react-router-dom";

const LibrarySelector = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(
    localStorage.getItem("libraryName") || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibraries = async () => {
      const data = await fetchData("/public/libraries/list", "GET");
      setLibraries(data);
      localStorage.setItem("libraryName", data[0]);
    };
    fetchLibraries();
  }, []);

  const handleLibraryChange = (e) => {
    const selectedLibraryName = e.target.value;
    localStorage.setItem("libraryName", selectedLibraryName);
    window.dispatchEvent(new Event("libraryChanged"));
    setSelectedLibrary(selectedLibraryName);
    let pathname = window.location.pathname;
    if (pathname.includes("viewBook")) {
      navigate("/");
    } else {
      navigate(window.location.pathname);
    }
  };

  return (
    <div>
      <select
        className="form-select bg-dark text-light"
        value={selectedLibrary}
        onChange={handleLibraryChange}
        aria-label="Select library"
      >
        <option key="default" value="" disabled hidden>
          Select a library
        </option>
        {Array.isArray(libraries) &&
          libraries.map((library) => (
            <option key={library} value={library}>
              {library}
            </option>
          ))}
      </select>
    </div>
  );
};

export default LibrarySelector;
