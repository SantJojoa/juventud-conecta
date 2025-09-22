import { AuthService } from './authService';

const BASE_URL = 'http://localhost:5000/api';

export const RecommendationService = {
    getForUser: async (userId) => {
        const res = await fetch(`${BASE_URL}/users/${userId}/recommendations`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Error al obtener recomendaciones');
        }
        return res.json();
    }
};


