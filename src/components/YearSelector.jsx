import React, { useState, useRef, useEffect } from "react";

export default function YearSelector({
  yearsCount = 200,
  startDateFilter,
  setStartDateFilter,
  onChangeFetch = null,
}) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: yearsCount }, (_, i) => currentYear - i);
  const dropdownRef = useRef(null);

  const toggleOpen = () => setOpen((o) => !o);

  const selectYear = (year) => {
    setStartDateFilter(new Date(year, 0, 1));
    setOpen(false);
    if (onChangeFetch) onChangeFetch();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isValidDate = (d) => d instanceof Date && !isNaN(d);

  return (
    <div className="dropdown" ref={dropdownRef} style={{ width: 120 }}>
      <button
        className="btn btn-outline-secondary dropdown-toggle w-80"
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {isValidDate(startDateFilter)
          ? startDateFilter.getFullYear()
          : "Select a year"}
      </button>

      {open && (
        <ul
          className="dropdown-menu show"
          role="listbox"
          style={{
            maxHeight: 150,
            overflowY: "auto",
            width: "100%",
          }}
        >
          {years.map((year) => (
            <li
              key={year}
              role="option"
              aria-selected={isValidDate(startDateFilter) && startDateFilter.getFullYear() === year}
              className={
                "dropdown-item" +
                (isValidDate(startDateFilter) && startDateFilter.getFullYear() === year ? " active" : "")
              }
              onClick={() => selectYear(year)}
              style={{ cursor: "pointer" }}
            >
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
