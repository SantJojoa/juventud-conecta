// Servicio para manejar operaciones relacionadas con el perfil de usuario
const API_URL = 'http://localhost:5000/api/users';

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token, usuario no autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Resultado de la actualización
 */
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token, usuario no autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    throw error;
  }
};


/**
 * Obtiene los eventos favoritos del usuario
 * @returns {Promise<Array>} Lista de eventos favoritos
 */


export const getFavoriteEvents = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token, usuario no autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los eventos favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getFavoriteEvents:', error);
    throw error;
  }
};


/**
 * Agrega un evento a favoritos
 * @param {string} eventId - ID del evento a agregar a favoritos
 * @returns {Promise<Object>} Resultado de la operación
 */
export const addToFavorites = async (eventId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token, usuario no autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir a favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en addToFavorites:', error);
    throw error;
  }
};

/**
 * Elimina un evento de favoritos
 * @param {string} eventId - ID del evento a eliminar de favoritos
 * @returns {Promise<Object>} Resultado de la operación
 */
export const removeFromFavorites = async (eventId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token, usuario no autenticado');
  }

  try {
    const response = await fetch(`${API_URL}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar de favoritos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en removeFromFavorites:', error);
    throw error;
  }
};

/**
 * Verifica si un evento está en favoritos
 * @param {string} eventId - ID del evento a verificar
 * @returns {Promise<boolean>} true si está en favoritos, false en caso contrario
 */
export const checkIsFavorite = async (eventId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false; // Si no hay token, no puede estar en favoritos
  }

  try {
    const response = await fetch(`${API_URL}/favorites/${eventId}/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    console.error('Error en checkIsFavorite:', error);
    return false;
  }
};