import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./ListEvents.css";

import { useEvents } from "../../hooks/useEvents";
import { useEventPopup } from "../../hooks/useEventPopup";
import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import LoadingIndicator from "../shared/LoadingIndicator";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyStateMessage from "../shared/EmptyStateMessage";
import EventCard from "../shared/EventCard";
import EventPopup from "../shared/EventPopup";
import EditEventForm from "../shared/EditEventForm";

const ListEvents = () => {
    const { events, loading, error, setEvents } = useEvents();
    const { selectedEvent, openEventPopup, closeEventPopup } = useEventPopup();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check if user is admin
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

            // Update local state
            const updatedEvents = events.filter(event => event._id !== eventId);
            setEvents(updatedEvents);
            setFilteredEvents(prevFiltered =>
                prevFiltered.filter(event => event._id !== eventId)
            );

            // Close popup if the deleted event is currently selected
            if (selectedEvent && selectedEvent._id === eventId) {
                closeEventPopup();
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Error al eliminar el evento");
        }
    };

    const handleEventUpdate = (updatedEvent) => {
        // Update both events arrays with the updated event data
        const updateEventInArray = (eventsArray) =>
            eventsArray.map(event =>
                event._id === updatedEvent._id ? { ...event, ...updatedEvent } : event
            );

        setEvents(updateEventInArray(events));
        setFilteredEvents(updateEventInArray(filteredEvents));

        // If this event is currently in the popup, update it there too
        if (selectedEvent && selectedEvent._id === updatedEvent._id) {
            openEventPopup({ ...selectedEvent, ...updatedEvent });
        }

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
                {searchTerm && (
                    <Link to="/" className="back-button">
                        Volver al listado
                    </Link>
                )}
            </div>

            <div className="events-grid">
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event._id}
                        event={event}
                        onClick={openEventPopup}
                        onEdit={setSelectedEventForEdit}
                        onDelete={handleDeleteEvent}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>

            {selectedEvent && (
                <EventPopup
                    event={selectedEvent}
                    onClose={closeEventPopup}
                    onEventUpdated={handleEventUpdate}
                    onEventDeleted={handleDeleteEvent}
                />
            )}

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