import { useEffect, useState, useCallback } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";

const GenresComponent = () => {
	const [genres, setGenres] = useState([]);
	const [token] = useState(localStorage.getItem("token"));
	const [modals, setModals] = useState({
		add: false,
		edit: false,
		delete: false,
	});
	const [selectedGenre, setSelectedGenre] = useState(null);
	const [page, setPage] = useState(0);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (page === 0) setGenres([]);
		fetchGenres(page);
	}, [page]);

	const fetchGenres = useCallback(
		async (page) => {
			if (isFetching) return;
			setIsFetching(true);
			try {
				if (page === undefined) {
					page = 0;
				}
				const params = new URLSearchParams({ page: page, size: "30" });

				await new Promise((resolve) => setTimeout(resolve, 500));
				const data = await fetchData(
					`/genres?${params.toString()}`,
					"GET",
					null,
					token
				);
				const newGenres = data.message || [];
				setGenres((prev) => (page === 0 ? newGenres : [...prev, ...newGenres]));
			} catch (err) {
				toast.error(err.message || "Failed to load genres.");
			} finally {
				setIsFetching(false);
			}
		},
		[token, isFetching]
	);

	const handleAddGenre = async (newName) => {
		try {
			await fetchData("/genres", "POST", newName, token);
			toast.success(`Genre added successfully!`);
			setModals({ ...modals, add: false, edit: false });
			fetchGenres();
		} catch (err) {
			toast.error(err.message || "Failed to save genre.");
		}
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
			setPage(0);
			fetchGenres();
		} catch (err) {
			toast.error(err.message || "Failed to delete genre.");
		}
	};

	return (
		<main className="container" style={{ overflowX: "hidden" }}>
			<InfiniteScroll
				dataLength={genres.length}
				next={() => setPage((prev) => prev + 1)}
				hasMore={!isFetching && genres.length % 30 === 0}
				loader={<Loading />}
				endMessage={
					<p className="text-center mt-3 text-muted">No more genres to load.</p>
				}
			>
				<section className="row w-100">
					{genres.map((genre) => (
						<div key={genre.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
							<article className="card">
								<div className="card-body d-flex justify-content-between align-items-center">
									<h5 className="card-title text-truncate">{genre.name}</h5>
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
					))}
				</section>
			</InfiniteScroll>

			<button
				className="btn btn-primary fixed-bottom m-3 w-25"
				onClick={() => setModals({ ...modals, add: true })}
			>
				+ Add Genre
			</button>

			<RenameAttributeModal
				show={modals.edit}
				handleClose={() => setModals({ ...modals, edit: false })}
				handleRename={(id, name) => handleAddGenre(name)}
				attribute={selectedGenre}
			/>
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
