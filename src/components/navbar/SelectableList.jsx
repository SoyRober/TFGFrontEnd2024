import { useState } from "react";

const SelectableList = ({
	label,
	items,
	selectedItems,
	handleAddItem,
	handleRemoveItem,
}) => {
	const [search, setSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	//Filter non selected items based on search input
	const filteredItems = items
		.filter((item) => !selectedItems.includes(item))
		.filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()));

	const handleInputChange = (e) => {
		setSearch(e.target.value);
		setShowDropdown(true);
	};

	const handleSelectItem = (item) => {
		handleAddItem(item);
		setSearch("");
		setShowDropdown(false);
	};

	const handleBlur = () => {
		//Small delay to allow click events to register
		setTimeout(() => setShowDropdown(false), 100);
	};

	return (
		<>
			<div className="selected-items" aria-label={`Selected ${label}s`}>
				{Array.isArray(selectedItems) &&
					selectedItems.map((item) => (
						<span
							key={item}
							className="badge bg-primary me-2"
							aria-label={`Selected ${label}: ${item}`}
						>
							{item}{" "}
							<button
								type="button"
								className="btn-close btn-close-white"
								onClick={() => handleRemoveItem(item)}
								aria-label={`Remove ${label}: ${item}`}
							/>
						</span>
					))}
			</div>
			<div className="form-group mt-3" style={{ position: "relative" }}>
				<label htmlFor={`new${label}`}>Add New {label}</label>
				<input
					type="text"
					className="form-control"
					id={`new${label}`}
					value={search}
					onChange={handleInputChange}
					onFocus={() => setShowDropdown(true)}
					onBlur={handleBlur}
					placeholder={`Type to search ${label.toLowerCase()}...`}
					aria-label={`Search and select a ${label.toLowerCase()}`}
					autoComplete="off"
				/>
				{showDropdown && filteredItems.length > 0 && (
					<ul
						className="list-group"
						style={{
							position: "absolute",
							zIndex: 1000,
							width: "100%",
							maxHeight: 180,
							overflowY: "auto",
							marginTop: 2,
						}}
					>
						{filteredItems.map((item) => (
							<li
								key={item}
								className="list-group-item list-group-item-action"
								style={{ cursor: "pointer" }}
								onMouseDown={() => handleSelectItem(item)}
								tabIndex={0}
								aria-label={`Add ${label}: ${item}`}
							>
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};

export default SelectableList;
