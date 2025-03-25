// components/shared/EventCard.jsx
import React from 'react';

const EventCard = ({ event, onClick }) => (
    <div className="event-card" onClick={() => onClick(event)}>
        <div className="event-image-container">
            <img
                src={event.imageSrc}
                alt={event.title || 'Imagen del evento'}
                className="event-image"
            />
        </div>
        <div className="event-info">
            <h3 className="event-title">{event.title || 'Sin título'}</h3>
            <p className="event-date">
                {event.date ? new Date(event.date).toLocaleDateString() : 'Fecha no disponible'}
            </p>
        </div>
    </div>
);

export default EventCard;