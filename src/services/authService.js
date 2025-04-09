// services/authService.js
const API_URL = "http://localhost:5000/api/auth";

export const AuthService = {
    getToken: () => localStorage.getItem("token"),

    isAuthenticated: () => !!localStorage.getItem("token"),

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
        localStorage.setItem("userName", data.name);

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
        localStorage.setItem("userName", data.name);

        window.dispatchEvent(new Event('login-change'));

        return data;
    },

    registerAdmin: async (name, email, password) => {
        const response = await fetch(`${API_URL}/register-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, email, password })

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
        localStorage.removeItem("userName");

        window.dispatchEvent(new Event('login-change'));
    }



};