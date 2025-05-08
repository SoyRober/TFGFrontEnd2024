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
        };
        fetchLibraries();
    }, []);

    const handleLibraryChange = async (e) => {
        const selectedLibraryName = e.target.value;
        localStorage.setItem("libraryName", selectedLibraryName);
        setSelectedLibrary(selectedLibraryName);
        navigate("/libraryHomepage");
    };

    return (
        <div>
            <select
                className="form-select bg-dark text-light"
                value={selectedLibrary}
                onChange={handleLibraryChange}
                aria-label="Library Selector Dropdown"
            >
                <option key="default" value="" disabled aria-label="Default Library Option">
                    Select a library
                </option>
                {libraries.map((library) => (
                    <option key={library} value={library} aria-label={`Library ${library}`}>
                        {library}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LibrarySelector;
