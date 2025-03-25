const BASE_URL = 'http://localhost:5000/api';

export const EventService = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/events`);
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${BASE_URL}/events/${id}`);
        return response.json();
    },

    create: async (eventData, token) => {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData),
        });
        return response.json();
    },

    delete: async (id, token) => {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};