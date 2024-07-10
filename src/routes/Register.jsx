import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      password: password,
      email: email,
      birthDate: birthDate
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage("Registro exitoso");
      } else {
        setMessage("Error al registrar. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al realizar el registro:", error);
      setMessage("Error al conectar con el servidor.");
    }
  };

  return (
      <div className="container mt-5">
        <h2>Registro</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">Birth Date:</label>
          <input
            type="date"
            className="form-control"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          </div>
          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>
        </form>
      </div>
  );
};

export default Register;
