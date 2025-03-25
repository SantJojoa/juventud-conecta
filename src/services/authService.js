// services/authService.js
export const AuthService = {
    getToken: () => localStorage.getItem("token"),

    isAuthenticated: () => !!localStorage.getItem("token"),

    getAuthHeaders: () => ({
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    })
};