import "../styles/main.css";
import { useEffect } from "react";

const DarkButton = () => {
    const toggleDarkMode = () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    }, []);

    const iconClass = document.body.classList.contains("dark-mode") ? "fa-moon" : "fa-sun";

    return (
        <button className="sun-button" onClick={toggleDarkMode}>
            <i className={`fa-solid ${iconClass}`}></i>
        </button>
    );
};

export default DarkButton;
