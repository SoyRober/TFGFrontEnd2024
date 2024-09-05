import { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { fetchData } from '../utils/fetch.js';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (userRole === "USER") {
                navigate("/")
            }
        }
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) navigate("/")

        try {
            const data = await fetchData(`/getUsers?page=${page}`, 'GET', null, token);
            console.log(data.message)
            setUsers(data.message);
        } catch (error) {
            setErrorMessage("Error al cargar la lista de usuarios");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <h2>Lista de Usuarios</h2>
            {errorMessage && <Notification message={errorMessage} />}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={`${user.username}-${user.email}`}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default UsersList;
