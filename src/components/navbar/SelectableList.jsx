import { useState } from "react";

const SelectableList = ({
  label,
  items,
  selectedItems,
  handleAddItem,
  handleRemoveItem,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleSelectChange = (value) => {
    if (value) {
      handleAddItem(value);
      setNewItem("");
    }
  };

  return (
    <>
      <div className="selected-items" aria-label={`Selected ${label}s`}>
        {Array.isArray(selectedItems) && selectedItems.map((item, index) => (
          <span
            key={index}
            className="badge bg-primary me-2"
            aria-label={`Selected ${label}: ${item}`}
          >
            {item}{" "}
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => handleRemoveItem(item)}
              aria-label={`Remove ${label}: ${item}`}
            ></button>
          </span>
        ))}
      </div>
      <div className="form-group mt-3">
        <label htmlFor={`new${label}`} aria-label={`Add New ${label} Label`}>
          Add New {label}
        </label>
        <select
          className="form-control"
          id={`new${label}`}
          value={newItem}
          onChange={(e) => handleSelectChange(e.target.value)}
          aria-label={`Select a ${label.toLowerCase()}`}
        >
          <option value="" aria-label={`Default ${label} Option`}>
            Select a {label.toLowerCase()}
          </option>
          {items
            .filter((item) => !selectedItems.includes(item))
            .map((item, index) => (
              <option key={index} value={item} aria-label={`${label}: ${item}`}>
                {item}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};

export default SelectableList;
