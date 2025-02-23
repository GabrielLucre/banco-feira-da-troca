import { jwtDecode } from "jwt-decode";

export const getUserData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Token inválido:", error);
        return null;
    }
};