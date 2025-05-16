import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/main.css";
import { jwtDecode } from "jwt-decode";
import useCheckTokenExpiration from "../../hooks/checkToken.jsx";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications.jsx";
import LibrarySelector from "./LibrarySelector.jsx";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
	const [hasPermissions, setHasPermissions] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useCheckTokenExpiration();

	const updatePermissions = () => {
		const token = localStorage.getItem("token");
		if (token) {
			const userRole = jwtDecode(token).role;

			setHasPermissions(userRole === "ADMIN" || userRole === "LIBRARIAN");
			setIsAdmin(userRole === "ADMIN");
		} else {
			setHasPermissions(false);
		}
	};

	useEffect(() => {
		if (localStorage.getItem("token")) {
			setIsLoggedIn(true);
			updatePermissions();
		} else {
			setIsLoggedIn(false);
			setHasPermissions(false);
		}
	}, [location]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
		setIsLoggedIn(false);
		setHasPermissions(false);
	};

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
				<div className="container-fluid">
					<Link
						className="navbar-brand text-light"
						to="/"
						aria-label="Home Link"
					>
						Home
					</Link>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav me-auto align-items-center">
							<li className="nav-item">
								<Link
									className="nav-link text-light ms-3"
									to="/search"
									aria-label="Search Link"
								>
									Search
								</Link>
							</li>
							{isLoggedIn && (
								<>
									<li className="nav-item">
										<Link
											className="nav-link text-light ms-3"
											to="/userBookDetails"
											aria-label="My Books Link"
										>
											My books
										</Link>
									</li>
									{hasPermissions && (
										<>
											<li className="nav-item">
												<Link
													className="nav-link text-light ms-3"
													to="/usersList"
													aria-label="Users List Link"
												>
													Users List
												</Link>
											</li>
											<li className="nav-item">
												<Link
													className="nav-link text-light ms-3"
													to="/attributes"
													aria-label="Attributes Link"
												>
													Attributes
												</Link>
											</li>
											<li className="nav-item">
												<Link
													className="nav-link text-light ms-3"
													to="/pendingBooks"
													aria-label="Pending Books Link"
												>
													PendingBooks
												</Link>
											</li>
											{isAdmin ? (
												<li className="nav-item">
													<Link
														className="nav-link text-light ms-3"
														to="/libraries"
														aria-label="Libraries Link"
													>
														Libraries
													</Link>
												</li>
											) : (
												<li className="nav-item">
													<Link
														className="nav-link text-light ms-3"
														to="/managedLibraries"
														aria-label="Managed Libraries Link"
													>
														Managed Libraries
													</Link>
												</li>
											)}
										</>
									)}
								</>
							)}
						</ul>

						<ul className="navbar-nav ms-auto d-flex flex-row align-items-center">
							<li className="nav-item me-3">
								<LibrarySelector />
							</li>
							{isLoggedIn ? (
								<>
									<li className="nav-item me-3">
										<Notifications />
									</li>
									<li className="nav-item dropdown">
										<button
											className="nav-link dropdown-toggle text-light bg-dark"
											id="navbarDropdown"
											data-bs-toggle="dropdown"
											aria-expanded="false"
											aria-label="Profile Dropdown Button"
										>
											<span className="d-none d-lg-inline">Profile</span>
											<i className="fas fa-user d-lg-none"></i>
										</button>
										<ul
											className="dropdown-menu dropdown-menu-end bg-dark"
											aria-labelledby="navbarDropdown"
											style={{ position: "absolute", zIndex: 1050 }}
										>
											<li>
												<Link
													className="dropdown-item text-light hover-navbar"
													to="/user/userSettings"
													aria-label="Settings Link"
												>
													Settings
												</Link>
											</li>
											<li>
												<button
													className="dropdown-item text-light hover-navbar"
													onClick={handleLogout}
													aria-label="Logout Button"
												>
													Log out
												</button>
											</li>
										</ul>
									</li>
								</>
							) : (
								<>
									<li className="nav-item">
										<Link
											className="nav-link text-light ms-3"
											to="/login"
											aria-label="Login Link"
										>
											Login
										</Link>
									</li>
									<li className="nav-item">
										<Link
											className="nav-link text-light ms-3"
											to="/register"
											aria-label="Register Link"
										>
											Register
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>

			<Outlet />
			<ToastContainer
				position={"bottom-right"}
				closeOnClick={true}
				draggable={true}
				theme={"dark"}
				aria-label="Toast Notifications"
			/>
		</>
	);
}
