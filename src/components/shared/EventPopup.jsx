import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import { checkIsFavorite, addToFavorites, removeFromFavorites } from '../../services/userService';
import { EventService } from '../../services/eventService';
import EditEventForm from './EditEventForm';
import Swal from 'sweetalert2';
import './EventPopup.css';
import { useNavigate } from 'react-router-dom';

const EventPopup = ({ event, onClose, onEventUpdated, onEventDeleted }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        setIsAdmin(localStorage.getItem('userRole') === 'admin');

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
    }, [onClose]);

    const handleToggleFavorite = async () => {
        if (!AuthService.isAuthenticated()) {
            alert('Debes iniciar sesión para guardar eventos como favoritos');
            return;
        }
        setIsLoading(true);
        try {
            if (isFavorite) {
                await removeFromFavorites(event._id);
                setIsFavorite(false);
            } else {
                await addToFavorites(event._id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            alert(error.message || 'Error al guardar el evento como favorito');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        // Usar SweetAlert2 en lugar de window.confirm
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede revertir. ¿Realmente deseas eliminar este evento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true);
                    const token = AuthService.getToken();
                    await EventService.delete(event._id, token);

                    // Si llegamos aquí, la eliminación fue exitosa
                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado correctamente.',
                        'success'
                    );

                    // Verificar si onEventDeleted existe antes de llamarla
                    if (typeof onEventDeleted === 'function') {
                        onEventDeleted(event._id);
                    }
                    onClose();

                } catch (error) {
                    console.error('Error deleting event:', error);
                    Swal.fire(
                        'Error',
                        error.message || 'Error al eliminar el evento',
                        'error'
                    );
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    // Handle event update after editing
    const handleEventUpdate = (updatedEvent) => {
        if (typeof onEventUpdated === 'function') {
            onEventUpdated({ ...event, ...updatedEvent });
        }
    };

    if (showEditForm) {
        return <EditEventForm event={event} onClose={() => setShowEditForm(false)} onEventUpdated={handleEventUpdate} />;
    }

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

                {/* Admin controls */}
                {isAdmin && (
                    <div className="popup-admin-controls">
                        <button className="edit-button" onClick={() => setShowEditForm(true)}>
                            Editar evento
                        </button>
                        <button className="delete-button" onClick={handleDeleteEvent}>
                            Eliminar evento
                        </button>
                    </div>
                )}

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
                    <button
                        className='more-info-button'
                        onClick={() => {
                            onClose();
                            navigate(`/event/${event._id}`);
                        }}
                    >
                        Ver más información
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventPopup;