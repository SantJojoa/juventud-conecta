import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { checkIsFavorite, addToFavorites, removeFromFavorites } from '../../services/userService';
import './EventPopup.css';

const EventPopup = ({ event, onClose }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (AuthService.isAuthenticated() && event._id) {
                try {
                    const favoriteStatus = await checkIsFavorite(event._id);
                    setIsFavorite(favoriteStatus);
                } catch (error) {
                    console.error('Error checking favorite status:', error);
                }
            }
        };
        checkFavoriteStatus();
    }, [event._id]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose])

    const handleToggleFavorite = async () => {
        if (!AuthService.isAuthenticated()) {
            alert('Debes iniciar sesión para guardar eventos como favoritos')
            return;
        }
        setIsLoading(true);
        try {
            if (isFavorite) {
                await removeFromFavorites(event._id);
                setIsFavorite(false)
            } else {
                await addToFavorites(event._id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            alert(error.message || 'Error al guardar el evento como favorito')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="event-popup-overlay" onClick={onClose}>
            <div className="event-popup" onClick={(e) => e.stopPropagation()}>
                {/* Botón de cerrar */}
                <div className="close-button-container">
                    <button className="close-popup" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Imagen del evento */}
                <div className="popup-image-container">
                    <img
                        src={event.imageSrc}
                        alt={event.title || 'Imagen del evento'}
                        className="popup-image"
                    />
                </div>

                {/* Contenido del evento */}
                <div className="popup-content">
                    <h2 className="popup-title">{event.title || 'Sin título'}</h2>

                    <p className="popup-date">
                        <strong>Fecha:</strong>{" "}
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Fecha no disponible'}
                    </p>

                    {event.schedule && (
                        <p className="popup-schedule">
                            <strong>Horario:</strong> {Array.isArray(event.schedule) ? event.schedule.join(', ') : event.schedule}
                        </p>
                    )}
                    <p className="popup-location">
                        <strong>Ubicación:</strong> {event.location || 'Ubicación no disponible'}
                    </p>
                    <p className="popup-description">
                        {event.description || 'Descripción no disponible'}
                    </p>
                </div>

                {/* Footer con botón de favoritos */}
                <div className="popup-footer">
                    <button
                        className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
                        onClick={handleToggleFavorite}
                        disabled={isLoading}
                    >
                        {isLoading ? "Cargando..." : (
                            isFavorite ? "❤️ Quitar de favoritos" : "🤍 Guardar como favorito"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventPopup;