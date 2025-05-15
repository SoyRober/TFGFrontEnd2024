import React from "react";

export default function YearSelector({ 
  yearsCount = 200,
  startDateFilter,
  setStartDateFilter,
  fetchBooksData = null
}) {
  const handleYearInputChange = (e) => {
    const val = e.target.value.trim();
    if (val === "") {
      setStartDateFilter(0);
      if (fetchBooksData) fetchBooksData(0);
      return;
    }
    const year = parseInt(val, 10);
    if (!isNaN(year)) {
      setStartDateFilter(new Date(year, 0, 1));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: yearsCount }, (_, i) => currentYear - i);

  return (
    <>
      <input
        list="year-list"
        id="year-input"
        name="year-input"
        value={startDateFilter ? startDateFilter.getFullYear() : ""}
        onChange={handleYearInputChange}
        placeholder="Selecciona un año"
        className="form-control form-control-sm me-2"
        aria-label="Filtro por año"
        autoComplete="off"
      />
      <datalist id="year-list">
        {years.map((year) => (
          <option key={year} value={year} />
        ))}
      </datalist>
    </>
  );
}
