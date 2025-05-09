import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactivationInfoModal from "../components/modals/ReactivationInfoModal.jsx";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [address, setAddress] = useState("");
	const [telephone, setTelephone] = useState("");
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const handleHideModal = () => setShowModal(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("token");

		if (token) {
			localStorage.setItem("token", token);
			toast.success("Registered successfully");
			navigate("/");
		}
	}, []);

	const handleGoogleSignUp = () => {
		window.location.href = "https://biliceu.store/oauth/login/google";
	};

	const handleRegister = async (e) => {
		e.preventDefault();

		const userData = {
			username: username,
			password: password,
			email: email,
			birthDate: birthDate,
			address: address,
			telephone: telephone,
			role: "USER",
			image: null,
		};

		try {
			const response = await fetchData(
				"/public/users/register",
				"POST",
				userData
			);

			if (response.success) {
				toast.success("Registered successfully. Now go to the login page");
				navigate("/login");
			} else {
				toast.error(response.message || "Registration error. Please try again");
			}
		} catch (error) {
			toast.error(error.message || "Something went wrong. Please try again");
		}
	};

	return (
		<main className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-4">
					<div className="card shadow-lg">
						<div className="card-body">
							<h2 className="card-title text-center mb-4">Sign Up</h2>
							<form onSubmit={handleRegister}>
								<div className="mb-3">
									<label htmlFor="username" className="form-label">
										Username
									</label>
									<input
										type="text"
										className="form-control shadow-sm"
										id="username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										aria-label="Enter your username"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">
										Password
									</label>
									<input
										type="password"
										className="form-control shadow-sm"
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										aria-label="Enter your password"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										type="email"
										className="form-control shadow-sm"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										aria-label="Enter your email address"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="birthDate" className="form-label">
										Birth Date
									</label>
									<input
										type="date"
										className="form-control shadow-sm"
										id="birthDate"
										value={birthDate}
										onChange={(e) => setBirthDate(e.target.value)}
										aria-label="Enter your birth date"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="address" className="form-label">
										Address
									</label>
									<input
										type="text"
										className="form-control shadow-sm"
										id="address"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										aria-label="Enter your address"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="telephone" className="form-label">
										Telephone
									</label>
									<input
										type="tel"
										className="form-control shadow-sm"
										id="telephone"
										value={telephone}
										onChange={(e) => setTelephone(e.target.value)}
										placeholder="No spaces or dashes"
										aria-label="Enter your telephone number"
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary w-100 shadow-sm"
									aria-label="Sign up for an account"
								>
									Sign Up
								</button>
								<button
									type="button"
									className="btn btn-danger w-100 shadow-sm mt-2"
									onClick={handleGoogleSignUp}
									aria-label="Sign up with Google"
								>
									Sign up with Google
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<ReactivationInfoModal
				show={showModal}
				handleClose={handleHideModal}
				aria-label="Reactivation information modal"
			/>
		</main>
	);
};

export default Register;
