import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ListEvents.css";

import { useEvents } from "../../hooks/useEvents";
import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import LoadingIndicator from "../shared/LoadingIndicator";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyStateMessage from "../shared/EmptyStateMessage";
import EventCard from "../shared/EventCard";
import EditEventForm from "../shared/EditEventForm";

const ListEvents = () => {
    const navigate = useNavigate();
    const { events, loading, error, setEvents } = useEvents();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsAdmin(localStorage.getItem("userRole") === "admin");
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search' || '');

        if (searchTerm && events.length > 0) {
            const filtered = events.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events);
        }
    }, [location.search, events]);

    const handleDeleteEvent = async (eventId) => {
        try {
            const token = AuthService.getToken();
            await EventService.delete(eventId, token);

            const updatedEvents = events.filter(event => event._id !== eventId);
            setEvents(updatedEvents);
            setFilteredEvents(prevFiltered =>
                prevFiltered.filter(event => event._id !== eventId)
            );

        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Error al eliminar el evento");
        }
    };

    const handleEventUpdate = (updatedEvent) => {
        const updateEventInArray = (eventsArray) =>
            eventsArray.map(event =>
                event._id === updatedEvent._id ? { ...event, ...updatedEvent } : event
            );

        setEvents(updateEventInArray(events));
        setFilteredEvents(updateEventInArray(filteredEvents));

        setSelectedEventForEdit(null);
    };

    if (loading) {
        return (
            <div className="list-events container">
                <LoadingIndicator message="Cargando eventos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-events-container">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="list-events-container">
                <EmptyStateMessage message="No hay eventos" />
            </div>
        );
    }

    if (filteredEvents.length === 0) {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('search' || '');

        return (
            <div className="list-events container">
                <div className="list event-header">
                    <h1>Resultados de la búsqueda: {searchTerm}</h1>
                    <Link to="/" className="back-button">Volver al listado</Link>
                </div>
                <EmptyStateMessage message="No hay eventos" />
            </div>
        );
    }

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');
    const headerTitle = searchTerm ? `Resultados de la búsqueda: ${searchTerm}` : 'Todos los eventos';


    return (

        <div className="list-events-container">
            <div className="list-events-header">
                <h1>{headerTitle}</h1>
            </div>
            <div className="event-image">
                <div className="events-grid">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            onEdit={setSelectedEventForEdit}
                            onDelete={handleDeleteEvent}
                            isAdmin={isAdmin}
                            onClick={() => navigate(`/edit-event/${id}`)}
                        />
                    ))}
                </div>
            </div>

            {selectedEventForEdit && (
                <EditEventForm
                    event={selectedEventForEdit}
                    onClose={() => setSelectedEventForEdit(null)}
                    onEventUpdated={handleEventUpdate}
                />
            )}
        </div>
    );
};

export default ListEvents;