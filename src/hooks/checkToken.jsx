import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const useCheckTokenExpiration = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');

            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    logout();
                }
            }
        };

        const logout = () => {
            localStorage.removeItem('token');
            navigate('/');  
        };

        checkTokenExpiration();
    }, [navigate]);
};

export default useCheckTokenExpiration;