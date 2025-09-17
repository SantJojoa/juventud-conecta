// src/services/notificationService.js
import { AuthService } from './authService';
const BASE_URL = 'http://localhost:5000/api';

export const NotificationService = {
    list: async () => {
        const res = await fetch(`${BASE_URL}/notifications`, { headers: AuthService.getAuthHeaders() });
        if (!res.ok) throw new Error('Error al obtener notificaciones');
        return res.json();
    },
    markRead: async (id) => {
        const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'PATCH', headers: AuthService.getAuthHeaders() });
        if (!res.ok) throw new Error('Error al marcar notificación');
        return res.json();
    },
    markAllRead: async () => {
        const res = await fetch(`${BASE_URL}/notifications/read-all`, { method: 'PATCH', headers: AuthService.getAuthHeaders() });
        if (!res.ok) throw new Error('Error al marcar todas');
        return res.json();
    }
};