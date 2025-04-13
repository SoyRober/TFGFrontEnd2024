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
		handleAddItem(value);
		setNewItem("");
	};

	return (
		<>
			<div className="selected-items">
				{selectedItems.map((item, index) => (
					<span key={index} className="badge bg-primary me-2">
						{item}{" "}
						<button
							type="button"
							className="btn-close btn-close-white"
							onClick={() => handleRemoveItem(item)}
						></button>
					</span>
				))}
			</div>
			<div className="form-group mt-3">
				<label htmlFor={`new${label}`}>Add New {label}</label>
				<select
					className="form-control"
					id={`new${label}`}
					value={newItem}
					onChange={(e) => handleSelectChange(e.target.value)}
				>
					<option value="">Select a {label.toLowerCase()}</option>
					{items
						.filter((item) => !selectedItems.includes(item))
						.map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
				</select>
			</div>
		</>
	);
};

export default SelectableList;
