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

    update: async (id, eventData, token) => {
        try {
            const response = await fetch(`${BASE_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                // Intenta obtener el error como JSON si es posible
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al actualizar el evento');
                } catch (jsonError) {
                    // Si no puede ser parseado como JSON, usar el texto o el estado
                    throw new Error(`Error al actualizar el evento: ${response.status} ${response.statusText}`);
                }
            }

            return await response.json();
        } catch (error) {
            console.error('Error en la actualización del evento:', error);
            throw error;
        }
    },

    delete: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Intenta obtener el error como JSON si es posible
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al eliminar el evento');
                } catch (jsonError) {
                    // Si no puede ser parseado como JSON, usar el texto o el estado
                    throw new Error(`Error al eliminar el evento: ${response.status} ${response.statusText}`);
                }
            }

            // Manejo especial para respuestas exitosas sin contenido (204 No Content)
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return { success: true };
            }

            // Intenta parsear la respuesta como JSON solo si hay contenido
            try {
                return await response.json();
            } catch (jsonError) {
                // Si la respuesta no es JSON pero fue exitosa, devolver éxito
                return { success: true };
            }
        } catch (error) {
            console.error('Error en la eliminación del evento:', error);
            throw error;
        }
    }
};