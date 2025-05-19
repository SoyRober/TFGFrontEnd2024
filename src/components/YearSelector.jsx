import { useState, useRef, useEffect } from "react";

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
<div className="dropdown" ref={dropdownRef} style={{ width: "100%" }}>
  <button
    type="button"
    onClick={toggleOpen}
    aria-expanded={open}
    aria-haspopup="listbox"
    aria-label="Select a year"
    className="form-control form-control d-flex justify-content-between align-items-center"
    style={{ cursor: "pointer" }}
  >
    <span>
      {isValidDate(startDateFilter)
        ? startDateFilter.getFullYear()
        : "Select a year"}
    </span>
    <span className="dropdown-toggle"></span>
  </button>

  {open && (
    <ul
      className="dropdown-menu show"
      role="listbox"
      tabIndex={-1}
      style={{
        maxHeight: 150,
        overflowY: "auto",
        width: "100%",
      }}
      aria-activedescendant={
        isValidDate(startDateFilter)
          ? `year-option-${startDateFilter.getFullYear()}`
          : undefined
      }
    >
      {years.map((year) => (
        <li
          key={year}
          id={`year-option-${year}`}
          role="option"
          aria-selected={
            isValidDate(startDateFilter) &&
            startDateFilter.getFullYear() === year
          }
          className={
            "dropdown-item" +
            (isValidDate(startDateFilter) &&
            startDateFilter.getFullYear() === year
              ? " active"
              : "")
          }
          onClick={() => selectYear(year)}
          style={{ cursor: "pointer" }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              selectYear(year);
            }
          }}
        >
          {year}
        </li>
      ))}
    </ul>
  )}
</div>

  );
}
