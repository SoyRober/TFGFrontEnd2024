import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetch.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const navigate = useNavigate();

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
          <div
            className="card shadow-lg"
            role="region"
            aria-labelledby="signup-title"
          >
            <div className="card-body">
              <h2 id="signup-title" className="card-title text-center mb-4">
                Sign Up
              </h2>
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 shadow-sm"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100 shadow-sm mt-2"
                  onClick={handleGoogleSignUp}
                >
                  Sign up with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
