import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ListEvents.css";

const ListEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events");
                if (!response.ok) {
                    throw new Error("Error al cargar los eventos");
                }
                const data = await response.json();
                setEvents(Array.isArray(data) ? data : []);
                setError(null);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const openEventPopup = (event) => {
        setSelectedEvent(event);
    };

    const closeEventPopup = () => {
        setSelectedEvent(null);
    };

    if (loading) {
        return (
            <div className="list-events-container">
                <div className="loading-indicator">Cargando eventos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-events-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="list-events-container">
                <div className="no-events-message">No hay eventos disponibles actualmente.</div>
            </div>
        );
    }

    return (
        <div className="list-events-container">
            <div className="list-events-header">
                <h1>Todos los eventos</h1>
                <Link to="/" className="back-button">
                    Volver al inicio
                </Link>
            </div>

            <div className="events-grid">
                {events.map((event) => (
                    <div
                        key={event._id}
                        className="event-card"
                        onClick={() => openEventPopup(event)}
                    >
                        <div className="event-image-container">
                            <img
                                src={event.imageSrc}
                                alt={event.title}
                                className="event-image"
                            />
                        </div>
                        <div className="event-info">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-date">
                                {new Date(event.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="event-popup-overlay" onClick={closeEventPopup}>
                    <div className="event-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="close-popup" onClick={closeEventPopup}>
                            &times;
                        </button>
                        <div className="popup-image-container">
                            <img
                                src={selectedEvent.imageSrc}
                                alt={selectedEvent.title}
                                className="popup-image"
                            />
                        </div>
                        <div className="popup-content">
                            <h2 className="popup-title">{selectedEvent.title}</h2>
                            <p className="popup-date">
                                <strong>Fecha:</strong>{" "}
                                {new Date(selectedEvent.date).toLocaleDateString()}
                            </p>
                            <p className="popup-schedule">
                                <strong>Horario:</strong> {selectedEvent.schedule}
                            </p>
                            <p className="popup-location">
                                <strong>Ubicación:</strong> {selectedEvent.location}
                            </p>
                            <p className="popup-description">{selectedEvent.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListEvents;