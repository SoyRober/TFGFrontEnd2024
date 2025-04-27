import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { jwtDecode } from "jwt-decode";
import { fetchData } from "../utils/fetch";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../img/defaultAvatar.svg";
import { compressImage } from "../utils/compressImage";
import { toast } from "react-toastify";
import EditDateModal from "../components/modals/EditDateModal";

export default function Settings() {
	const [role, setRole] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalAttribute, setModalAttribute] = useState("");
	const [modalValue, setModalValue] = useState("");
	const [showDeactivationConfirmationModal, setShowDeleteConfirmationModal] =
		useState(false);
	const [showDateModal, setShowDateModal] = useState(false);
	const [dateErrorMessage, setDateErrorMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			getUserInfo(token);
		} else {
			navigate("/");
		}
	}, [navigate]);

	const getUserInfo = async (token) => {
		const decodedToken = jwtDecode(token);
		const data = await fetchData(
			`/users/info/profile/${decodedToken.email}`,
			"GET",
			null,
			token
		);
		if (data.success) {
			setRole(data.message.role);
			setUsername(data.message.username);
			setEmail(data.message.email);
			setBirthDate(data.message.birthday);
			setProfileImage(
				data.message.profileImage
					? `data:image/jpeg;base64,${data.message.profileImage}`
					: null
			);
		} else {
			toast.error("An unexpected error occurred.");
			navigate("/");
		}
	};

	const handleEditAttribute = (attribute, currentValue) => {
		if (attribute === "birthdate") {
			setModalValue(currentValue);
			setShowDateModal(true);
		} else {
			setModalAttribute(attribute);
			setModalValue(currentValue);
			setShowModal(true);
		}
	};

	const handleSaveAttribute = async () => {
		try {
			if (!modalValue) {
				toast.error("The field is required.");
				return;
			}

			const token = localStorage.getItem("token");
			const decodedToken = jwtDecode(token);

			const url = getUpdateUrl(decodedToken.email, modalAttribute);
			const formData = await prepareFormData(modalAttribute, modalValue);

			const data = await fetchData(url, "PUT", formData, token);

			if (data.success) {
				updateStateAfterSave(modalAttribute, modalValue, data.message);
				setShowModal(false);
				toast.success(`Successfully updated ${modalAttribute}`);
			} else {
				toast.error(data.message || `Error: ${modalAttribute} not changed`);
			}
		} catch (error) {
			toast.error(error.message || "An unexpected error occurred.");
		}
	};

	const handleSaveDate = async () => {
		try {
			if (!modalValue) {
				setDateErrorMessage("The field is required.");
				return;
			}

			const token = localStorage.getItem("token");
			const decodedToken = jwtDecode(token);

			const url = getUpdateUrl(decodedToken.email, "birthdate");
			const formData = new FormData();
			formData.append("attribute", "birthdate");
			formData.append("newAttribute", modalValue);

			const data = await fetchData(url, "PUT", formData, token);

			if (data.success) {
				setBirthDate(modalValue);
				setShowDateModal(false);
				toast.success("Successfully updated birthdate");
			} else {
				toast.error(data.message || "Error: birthdate not changed");
			}
		} catch (error) {
			toast.error(error.message || "An unexpected error occurred.");
		}
	};

	const getUpdateUrl = (email, attribute) => {
		if (attribute === "image") {
			return `/users/update/profileImage/${email}`;
		}
		return `/users/update/${email}`;
	};

	const prepareFormData = async (attribute, value) => {
		const formData = new FormData();

		if (attribute === "image") {
			if (!value) {
				throw new Error("Please select an image.");
			}
			const compressedImage = await compressImage(value, 1, 400, 400);
			formData.append("newImage", compressedImage);
		} else {
			formData.append("attribute", attribute || "");
			formData.append("newAttribute", value || "");
		}

		return formData;
	};

	const updateStateAfterSave = (attribute, value, token) => {
		if (attribute === "image") {
			const reader = new FileReader();
			reader.onloadend = () => setProfileImage(reader.result);
			reader.readAsDataURL(value);
		} else {
			switch (attribute) {
				case "username":
					setUsername(value);
					break;
				case "email":
					setEmail(value);
					break;
				case "birthdate":
					setBirthDate(value);
					break;
			}
		}

		if (attribute !== "password") {
			localStorage.setItem("token", token);
		}
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleDeactivationUser = async () => {
		try {
			const token = localStorage.getItem("token");
			const decodedToken = jwtDecode(token);

			const data = await fetchData(
				`/users/${decodedToken.email}`,
				"DELETE",
				null,
				token
			);

			if (data.success) {
				toast.success("User deleted successfully.");
				localStorage.removeItem("token");
				navigate("/");
			} else {
				toast.error(data.message || "Failed to delete user.");
			}
		} catch (error) {
			toast.error(error.message || "An unexpected error occurred.");
		}
	};

	const handleOpenDeleteModal = () => {
		setShowDeleteConfirmationModal(true);
	};

	const handleCloseDeactivationModal = () => {
		setShowDeleteConfirmationModal(false);
	};

	return (
		<main className="container mt-5">
			<h1 className="text-center mb-4">Settings</h1>

			<section className="card shadow-sm mb-4">
				<div
					className="card-body d-flex flex-column justify-content-center align-items-center"
					style={{ minHeight: "400px" }}
				>
					<div className="row w-100">
						<div className="col-md-4 d-flex justify-content-center mb-4">
							<div
								className="profile-image-container"
								style={{
									backgroundImage:
										profileImage != null
											? `url(${profileImage})`
											: `url(${defaultAvatar})`,
								}}
								role="button"
								tabIndex="0"
								onClick={() => handleEditAttribute("image", null)}
								aria-label="Change Profile Image"
							>
								<div className="hover-overlay">Change Profile Image</div>
							</div>
						</div>

						<div className="col-md-4 text-center">
							<h5 className="card-title mb-4">User Information</h5>
							<p className="card-text mb-4">Username: {username}</p>
							<p className="card-text mb-4">Email: {email}</p>
							<p className="card-text">
								BirthDate:{" "}
								{birthDate && !isNaN(new Date(birthDate).getTime())
									? new Date(birthDate).toLocaleDateString()
									: "N/A"}
							</p>
						</div>

						<div className="col-md-4 d-flex flex-column align-items-center mt-4">
							<button
								className="btn btn-primary mb-3 w-50"
								onClick={() => handleEditAttribute("username", username)}
							>
								Edit Username
							</button>
							<button
								className="btn btn-primary mb-3 w-50"
								onClick={() => handleEditAttribute("email", email)}
							>
								Edit Email
							</button>
							<button
								className="btn btn-primary mb-3 w-50"
								onClick={() => handleEditAttribute("birthdate", birthDate)}
							>
								Edit BirthDate
							</button>
							<button
								className="btn btn-secondary mb-3 w-50"
								onClick={() => handleEditAttribute("password", "")}
							>
								Change Password
							</button>
						</div>
					</div>
					<div>
						<button className="btn btn-danger" onClick={handleOpenDeleteModal}>
							Deactivate user
						</button>
					</div>
				</div>
			</section>

			<Modal show={showModal} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title>
						{modalAttribute === "password"
							? "Change Password"
							: modalAttribute === "image"
							? "Change Profile Image"
							: `Edit ${
									modalAttribute.charAt(0).toUpperCase() +
									modalAttribute.slice(1)
							  }`}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{modalAttribute === "image" ? (
						<Form.Group className="mt-3">
							<Form.Label>Upload New Profile Image</Form.Label>
							<Form.Control
								type="file"
								onChange={(e) => setModalValue(e.target.files[0])}
							/>
						</Form.Group>
					) : (
						<Form.Group className="mt-3">
							<Form.Label>
								{modalAttribute === "password"
									? "New Password"
									: `New ${
											modalAttribute.charAt(0).toUpperCase() +
											modalAttribute.slice(1)
									  }`}
							</Form.Label>
							<Form.Control
								type={modalAttribute === "password" ? "password" : "text"}
								value={modalValue}
								onChange={(e) => setModalValue(e.target.value)}
							/>
						</Form.Group>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSaveAttribute}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>

			<EditDateModal
				show={showDateModal}
				onClose={() => setShowDateModal(false)}
				attribute="BirthDate"
				value={modalValue}
				onChange={(e) => setModalValue(e.target.value)}
				onSave={handleSaveDate}
				errorMessage={dateErrorMessage}
			/>

			<Modal
				show={showDeactivationConfirmationModal}
				onHide={handleCloseDeactivationModal}
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Deletion</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					You wont be able to activate this account again when a month passes.
					Are you sure you want to deactivate your account?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseDeactivationModal}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDeactivationUser}>
						Deactivate
					</Button>
				</Modal.Footer>
			</Modal>
		</main>
	);
}
