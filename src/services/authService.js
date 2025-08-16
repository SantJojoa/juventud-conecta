// services/authService.js
const API_URL = "http://localhost:5000/api/auth";

export const AuthService = {
    getToken: () => localStorage.getItem("token"),

    isTokenExpired: () => {
        const token = localStorage.getItem('token')
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error al verificar el token', error);
            return true;
        }
    },

    isAuthenticated: () => {
        const hasToken = !!localStorage.getItem('token');
        if (!hasToken) return false;

        if (AuthService.isTokenExpired()) {
            AuthService.logout();
            return false;
        }
        return true;
    },

    getAuthHeaders: () => ({
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    }),

    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en el login");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);

        window.dispatchEvent(new Event('login-change'));

        return data;
    },

    register: async (firstName, lastName, email, password, phoneNumber, birthDate, avatarUrl) => {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                birthDate,
                avatarUrl
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en el registro");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);

        window.dispatchEvent(new Event('login-change'));

        return data;
    },

    checkEmail: async (email) => {
        const response = await fetch(`${API_URL}/check-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error("Error al validar el correo");
        }

        const data = await response.json();
        return !data.exists; // true = libre, false = ya está registrado
    },

    registerAdmin: async (firstName, lastName, email, password, phoneNumber, birthDate, avatarUrl) => {
        const response = await fetch(`${API_URL}/register-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firstName, lastName, email, password, phoneNumber, birthDate, avatarUrl
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar administrador')
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        window.dispatchEvent(new Event('login-change'));
    }
};