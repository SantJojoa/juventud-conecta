// components/shared/EventCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';


const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const EventCard = ({ event, onClick, onEdit, onDelete, isAdmin }) => {
    const navigate = useNavigate();

    return (
        <div
            className="event-card"
            onClick={() => onClick(event)}
        >
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
                    <span>Inicia:</span>{' '}
                    {event.startDate
                        ? capitalizeFirstLetter(
                            new Date(event.startDate).toLocaleDateString(
                                'es-ES',
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )
                        )
                        : 'Fecha no disponible'}
                    <br />
                    <span>Termina:</span>{' '}
                    {event.endDate
                        ? capitalizeFirstLetter(
                            new Date(event.endDate).toLocaleDateString(
                                'es-ES',
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )
                        )
                        : 'Fecha no disponible'}
                </p>
            </div>

            {isAdmin && (
                <div className="admin-controls">
                    <button
                        className="edit-button"
                        onClick={(e) => {
                            e.stopPropagation(); // evita que dispare el onClick del contenedor
                            navigate(`/edit-event/${event._id}`);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (
                                window.confirm(
                                    '¿Estás seguro de eliminar este evento?'
                                )
                            ) {
                                onDelete(event._id);
                            }
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};


export default EventCard;