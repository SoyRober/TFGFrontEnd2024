import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { toast } from "react-toastify";

export default function ManagedLibraries() {
	const [libraries, setLibraries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchManagedLibraries = async () => {
			setLoading(true);
			setError(null);
			try {
				const token = localStorage.getItem("token");
				const data = await fetchData(
					"/librarian/libraries/getManagedLibraries",
					"GET",
					null,
					token
				);
				setLibraries(data);
			} catch (err) {
				setError(err.message || "Failed to fetch managed libraries");
				toast.error(err.message || "Failed to fetch managed libraries");
			} finally {
				setLoading(false);
			}
		};
		fetchManagedLibraries();
	}, []);

	if (loading) {
		return (
			<div className="container mt-5" role="status" aria-live="polite">
				Loading managed libraries...
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="container mt-5 alert alert-danger"
				role="alert"
				aria-live="assertive"
			>
				{error}
			</div>
		);
	}

	return (
		<div className="container mt-5" role="main">
			<h1 tabIndex={-1}>My Managed Libraries</h1>
			{libraries.length === 0 ? (
				<p aria-live="polite">You do not manage any libraries.</p>
			) : (
				<ul className="list-group" aria-label="List of libraries you manage">
					{libraries.map((library) => (
						<li
							key={library.id}
							className="list-group-item d-flex flex-wrap align-items-center"
							style={{ padding: "10px" }}
						>
							<div className="row w-100">
								<div
									className="col-12 col-md-4 mb-2 mb-md-0"
									aria-label={`Library name: ${library.name}`}
								>
									<strong>Name:</strong> {library.name}
								</div>
								<div
									className="col-12 col-md-4 mb-2 mb-md-0"
									aria-label={`Library address: ${library.address}`}
								>
									<strong>Address:</strong> {library.address}
								</div>
							</div>
							<div className="col-12 mt-2" aria-label="Librarians">
								<strong>Librarians:</strong>{" "}
								{library.librarianNames && library.librarianNames.length > 0 ? (
									library.librarianNames.join(", ")
								) : (
									<em>No librarians</em>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
