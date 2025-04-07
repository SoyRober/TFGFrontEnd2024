import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";
import RenameAttributeModal from "../components/modals/RenameAttributeModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import AddAttributeModal from "../components/modals/AddAttributeModal";
import Loading from "../components/Loading";

const GenresComponent = () => {
	const [genres, setGenres] = useState([]);
	const [token] = useState(localStorage.getItem("token"));
	const [modals, setModals] = useState({
		add: false,
		edit: false,
		delete: false,
	});
	const [selectedGenre, setSelectedGenre] = useState(null);

	useEffect(() => {
		fetchGenres();
	}, [token]);

	const fetchGenres = async () => {
		try {
			const data = await fetchData("/genres", "GET", null, token);
			setGenres(data);
		} catch (err) {
			toast.error(err.message || "Failed to load genres.");
		}
	};

	const handleAddGenre = async (newName) => {
		const body = { newName };
		try {
			await fetchData("/genres", "POST", newName, token);
			toast.success(`Genre added successfully!`);
			setModals({ ...modals, add: false, edit: false });
			fetchGenres();
		} catch (err) {
			toast.error(err.message || "Failed to save genre.");
		}
		console.log("🚀 ~ handleAddGenre ~ body:", body);
	};

	const handleEditGenre = async (id, name) => {
		const body = { id, name };
		try {
			await fetchData("/genres", "PUT", body, token);
			toast.success(`Genre updated successfully!`);
			setModals({ ...modals, add: false, edit: false });
			fetchGenres();
		} catch (err) {
			toast.error(err.message || "Failed to save genre.");
		}
	};

	const handleDeleteGenre = async () => {
		try {
			await fetchData(`/genres/${selectedGenre.id}`, "DELETE", null, token);
			toast.success("Genre deleted successfully!");
			setModals({ ...modals, delete: false });
			fetchGenres();
		} catch (err) {
			toast.error(err.message || "Failed to delete genre.");
		}
	};

	return (
		<main className="container">
			<section className="row">
				{genres.length > 0 ? (
					genres.map((genre) => (
						<div key={genre.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
							<article className="card">
								<div className="card-body d-flex justify-content-between align-items-center">
									<h5 className="card-title">{genre.name}</h5>
									<div>
										<button
											className="btn btn-outline-primary btn-sm me-2"
											onClick={() => {
												setSelectedGenre(genre);
												setModals({ ...modals, edit: true });
											}}
										>
											<i className="bi bi-pencil"></i>
										</button>
										<button
											className="btn btn-outline-danger btn-sm"
											onClick={() => {
												setSelectedGenre(genre);
												setModals({ ...modals, delete: true });
											}}
										>
											<i className="bi bi-x"></i>
										</button>
									</div>
								</div>
							</article>
						</div>
					))
				) : (
					<Loading />
				)}
			</section>

			<button
				className="btn btn-primary fixed-bottom m-3 w-25"
				onClick={() => setModals({ ...modals, add: true })}
			>
				+ Add Genre
			</button>

			<RenameAttributeModal
				show={modals.edit}
				handleClose={() => setModals({ ...modals, edit: false })}
				handleRename={(id, name) => handleEditGenre(id, name)}
				attribute={selectedGenre}
			/>

			<DeleteConfirmationModal
				show={modals.delete}
				onClose={() => setModals({ ...modals, delete: false })}
				onDelete={handleDeleteGenre}
				message={`Delete ${selectedGenre?.name}? This action will also remove it from all books.`}
			/>

			<AddAttributeModal
				show={modals.add}
				handleClose={() => setModals({ ...modals, add: false })}
				handleAdd={(name) => handleAddGenre(name)}
			/>
		</main>
	);
};

export default GenresComponent;
