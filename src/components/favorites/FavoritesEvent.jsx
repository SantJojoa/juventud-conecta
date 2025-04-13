import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FavoritesEvent.css';
import { useEventPopup } from "../../hooks/useEventPopup";
import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import LoadingIndicator from "../shared/LoadingIndicator";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyStateMessage from "../shared/EmptyStateMessage";
import EventCard from "../shared/EventCard";
import EventPopup from "../shared/EventPopup";

function FavoritesEvent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedEvent, openEventPopup, closeEventPopup } = useEventPopup();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchFavoriteEvents();
        } else {
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const fetchFavoriteEvents = async () => {
        try {
            setLoading(true);
            const token = AuthService.getToken();

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            console.log("Obteniendo eventos favoritos...");
            const response = await fetch('http://localhost:5000/api/users/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Datos de favoritos recibidos:", data);

                // La estructura correcta según el backend es data.formattedEvents
                if (data && Array.isArray(data.formattedEvents)) {
                    console.log("Usando formattedEvents:", data.formattedEvents);
                    setFavoriteEvents(data.formattedEvents);
                } else if (data && Array.isArray(data.favorites)) {
                    // Mantener compatibilidad con otros posibles formatos
                    setFavoriteEvents(data.favorites);
                } else if (data && Array.isArray(data.events)) {
                    setFavoriteEvents(data.events);
                } else if (data && Array.isArray(data)) {
                    setFavoriteEvents(data);
                } else {
                    console.error("Formato de respuesta inesperado:", data);
                    setError('Formato de respuesta inesperado para eventos favoritos');
                    setFavoriteEvents([]);
                }
            } else {
                console.error('Error al obtener eventos favoritos:', response.status);
                setError('Error al obtener eventos favoritos');
            }
        } catch (error) {
            console.error('Error en fetchFavoriteEvents:', error);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleEventUpdate = (updatedEvent) => {
        // Actualizar el evento en el array de favoritos
        setFavoriteEvents(favoriteEvents.map(event =>
            event._id === updatedEvent._id ? { ...event, ...updatedEvent } : event
        ));

        // Si este evento está actualmente en el popup, actualizarlo también allí
        if (selectedEvent && selectedEvent._id === updatedEvent._id) {
            openEventPopup({ ...selectedEvent, ...updatedEvent });
        }
    };

    const handleRemoveFromFavorites = async (eventId) => {
        try {
            const token = AuthService.getToken();

            if (!token) return;

            const response = await fetch(`http://localhost:5000/api/users/favorites/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Actualizar estado local
                setFavoriteEvents(favoriteEvents.filter(event => event._id !== eventId));

                // Cerrar popup si el evento eliminado está actualmente seleccionado
                if (selectedEvent && selectedEvent._id === eventId) {
                    closeEventPopup();
                }
            } else {
                console.error('Error al eliminar de favoritos');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Renderizado condicional según el estado
    if (loading) {
        return (
            <div className="favorites-container">
                <div className="header_favorites">
                    <div className="title_favorites">
                        <h1>Tus eventos favoritos en un solo lugar</h1>
                    </div>
                </div>
                <LoadingIndicator message="Cargando tus eventos favoritos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorites-container">
                <div className="header_favorites">
                    <div className="title_favorites">
                        <h1>Tus eventos favoritos en un solo lugar</h1>
                    </div>
                </div>
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="favorites-container">
                <div className="header_favorites">
                    <div className="title_favorites">
                        <h1>Tus eventos favoritos en un solo lugar</h1>
                    </div>
                </div>
                <div className="content">
                    <h2>Empieza a crear tu lista de favoritos</h2>
                    <p>Inicia sesión para guardar y volver a visitar tus eventos favoritos en cualquier momento.</p>

                    <div className="action">
                        <Link to="/login" className="login-button">Iniciar sesión</Link>
                    </div>
                </div>
            </div>
        );
    }

    console.log("Eventos favoritos para renderizar:", favoriteEvents);

    return (
        <div className="favorites-container">
            <div className="header_favorites">
                <div className="title_favorites">
                    <h1>Tus eventos favoritos en un solo lugar</h1>
                </div>
            </div>

            <div className="favorites-content">
                {(!favoriteEvents || favoriteEvents.length === 0) ? (
                    <div className="no-favorites">
                        <EmptyStateMessage message="Aún no tienes eventos favoritos" />
                        <p>Explora nuestros eventos y marca como favorito los que te interesen.</p>
                        <Link to="/events" className="explore-button">Explorar eventos</Link>
                    </div>
                ) : (
                    <div className="favorites-list">
                        <div className="events-grid">
                            {favoriteEvents.map((event) => (
                                <EventCard
                                    key={event._id || event.id}
                                    event={event}
                                    onClick={openEventPopup}
                                    isInFavorites={true}
                                    onRemoveFromFavorites={handleRemoveFromFavorites}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <EventPopup
                    event={selectedEvent}
                    onClose={closeEventPopup}
                    onEventUpdated={handleEventUpdate}
                    isInFavorites={true}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                />
            )}

        </div>
    );
}

export default FavoritesEvent;