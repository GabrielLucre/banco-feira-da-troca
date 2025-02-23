/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const getToken = () => {
    return localStorage.getItem("token");
};

const PrivateRoute = ({ element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        axios
            .get('http://localhost:3000/auth/protected', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    if (isAuthenticated === null) {
        return
    }

    if (!isAuthenticated) {
        return <Navigate to="/venda" />;
    }

    return element;
};

export default PrivateRoute
