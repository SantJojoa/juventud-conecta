import React from 'react';

const EventPopup = ({ event, onClose }) => (
    <div className="event-popup-overlay" onClick={onClose}>
        <div className="event-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={onClose}>
                &times;
            </button>
            <div className="popup-image-container">
                <img
                    src={event.imageSrc}
                    alt={event.title || 'Imagen del evento'}
                    className="popup-image"
                />
            </div>
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
        </div>
    </div>
);

export default EventPopup;