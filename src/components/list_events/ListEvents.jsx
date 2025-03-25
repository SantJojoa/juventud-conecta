import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
            );
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events);
        }
    }, [location.search, events]);

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
                <EmptyStateMessageComponent message="No hay eventos" />
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
                <Link to="/" className="back-button">Volver al listado
                </Link>
            </div>

            <div className="events-grid">
                {filteredEvents.map((event) => (
                    <EventCard key={event._id} event={event} onClick={openEventPopup} />
                ))}
            </div>

            {selectedEvent && <EventPopup event={selectedEvent} onClose={closeEventPopup} />}

        </div>
    );

};

export default ListEvents;