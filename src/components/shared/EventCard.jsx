// components/shared/EventCard.jsx
import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onClick, onEdit, onDelete, isAdmin }) => (

    <div className="event-card"
        onClick={() => onClick(event)}
    >

        <div className="event-image-container" >
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


        {isAdmin && (
            <div className="admin-controls">
                <button
                    className='edit-button'
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(event)
                    }}
                >
                    Editar
                </button>
                <button
                    className='delete-button'
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Estás seguro de eliminar este evento?')) {
                            onDelete(event._id);
                        }
                    }}
                >Eliminar
                </button>
            </div>
        )}
    </div>
);

export default EventCard;