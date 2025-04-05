import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
<<<<<<< HEAD
import "./ListEvents.css";

const ListEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const location = useLocation();

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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search') || '';

        if (searchTerm && events.length > 0) {
            const filtered = events.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
=======
import "./ListEvents.css"


import { useEvents } from "../../hooks/useEvents";
import { useEventPopup } from "../../hooks/useEventPopup";

import LoadingIndicator from "../shared/LoadingIndicator";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyStateMessageComponent from "../shared/EmptyStateMessage";
import EventCard from "../shared/EventCard"
import EventPopUp from "../shared/EventPopup";
import EmptyStateMessage from "../shared/EmptyStateMessage";
import EventPopup from "../shared/EventPopup";



const ListEvents = () => {
    const { events, loading, error } = useEvents();
    const { selectedEvent, openEventPopup, closeEventPopup } = useEventPopup();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search' || '');

        if (searchTerm && events.length > 0) {
            const filtered = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            );
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events);
        }
    }, [location.search, events]);

<<<<<<< HEAD



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
=======
    if (loading) {
        return (
            <div className="list-events container">
                <LoadingIndicator message="Cargando eventos..." />
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-events-container">
<<<<<<< HEAD
                <div className="error-message">{error}</div>
=======
                <ErrorMessage message={error} />
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="list-events-container">
<<<<<<< HEAD
                <div className="no-events-message">No hay eventos disponibles actualmente.</div>
=======
                <EmptyStateMessageComponent message="No hay eventos" />
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            </div>
        );
    }

    if (filteredEvents.length === 0) {
<<<<<<< HEAD
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search') || '';
        return (
            <div className="list-events-container">
                <div className="list events-header">
                    <h1>Resultados de la búsqueda: {searchTerm}</h1>
                    <Link to="/" className="back-button">Volver al inicio</Link>
                </div>
                <div className="no-events-message">No hay eventos disponibles actualmente.</div>
=======

        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search' || '');


        return (
            <div className="list-events container">
                <div className="list event-header">
                    <h1>Resultados de la búsqueda: {searchTerm}</h1>
                    <Link to="/" className="back-button">Volver al listado</Link>
                </div>
                <EmptyStateMessage message="No hay eventos" />
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            </div>
        );
    }

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');
    const headerTitle = searchTerm ? `Resultados de la búsqueda: ${searchTerm}` : 'Todos los eventos';

<<<<<<< HEAD
=======

>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
    return (
        <div className="list-events-container">
            <div className="list-events-header">
                <h1>{headerTitle}</h1>
<<<<<<< HEAD
                <Link to="/" className="back-button">
                    Volver al inicio
=======
                <Link to="/" className="back-button">Volver al listado
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
                </Link>
            </div>

            <div className="events-grid">
                {filteredEvents.map((event) => (
<<<<<<< HEAD
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
=======
                    <EventCard key={event._id} event={event} onClick={openEventPopup} />
                ))}
            </div>

            {selectedEvent && <EventPopup event={selectedEvent} onClose={closeEventPopup} />}

        </div>
    );

>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
};

export default ListEvents;