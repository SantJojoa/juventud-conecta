// src/services/adminUserService.js
const BASE_URL = 'http://localhost:5000/api/admin';

export const AdminUserService = {
    list: async (token) => {
        const res = await fetch(`${BASE_URL}/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Error al listar usuarios');
        }
        return res.json();
    },

    delete: async (id, token) => {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok && res.status !== 204) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Error al eliminar usuario');
        }
        return { success: true };
    }
};