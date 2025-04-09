import React, { useState, useEffect } from 'react';
import './favorites_event.css';
import Events_favorite_options from '../events_favorite_options/events_favorite_options';
import Footer from '../footer/Footer';
import { Link } from 'react-router-dom';

function FavoritesEvent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [favoriteEvents, setFavoriteEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/favorites', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFavoriteEvents(data.favorites || []);
            } else {
                console.error('Error fetching favorite events');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="favorites-container">
            <div className="header_favorites">
                <div className="illustration">
                    <img src="/public/images/favorites.png" alt="Persona con corazón" />
                </div>
                <div className="title_favorites">
                    <h1>Tus eventos favoritos en un solo lugar</h1>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <p>Cargando tus eventos favoritos...</p>
                </div>
            ) : !isAuthenticated ? (
                // Contenido para usuarios no autenticados
                <div className="content">
                    <h2>Empieza a crear tu lista de favoritos</h2>
                    <p>Inicia sesión para guardar y volver a visitar tus eventos favoritos en cualquier momento.</p>

                    <div className="action">
                        <Link to="/login" className="login-button">Iniciar sesión</Link>
                    </div>
                </div>
            ) : (
                // Contenido para usuarios autenticados
                <div className="favorites-content">
                    {favoriteEvents.length === 0 ? (
                        <div className="no-favorites">
                            <h2>Aún no tienes eventos favoritos</h2>
                            <p>Explora nuestros eventos y marca como favorito los que te interesen.</p>
                            <Link to="/events" className="explore-button">Explorar eventos</Link>
                        </div>
                    ) : (
                        <div className="favorites-list">
                            <h2>Tus eventos favoritos</h2>
                            <div className="events-grid">
                                {favoriteEvents.map(event => (
                                    <div key={event.id} className="event-card">
                                        <img src={event.imageSrc} alt={event.title} className="event-image" />
                                        <div className="event-details">
                                            <h3>{event.title}</h3>
                                            <p>{event.date}</p>
                                            <Link to={`/events/${event.id}`} className="view-button">Ver detalles</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <Events_favorite_options />
            <Footer />
        </div>
    );
}

export default FavoritesEvent;