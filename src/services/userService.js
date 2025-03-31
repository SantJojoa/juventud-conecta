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
