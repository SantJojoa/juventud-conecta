import React from 'react';
import './EventDetails.css';

function EventDetails() {
    return (
        <div className="event-container">
            <div className="event-image-wrapper">
                <img
                    src="/src/image/galerasRock.webp"
                    alt="Tratamiento facial en spa"
                    className="spa-image"
                />
            </div>

            <div className="event-info-card">
                <div className="event-info-header">
                    <span className="event-tag">Fechas de Apertura - Galeras Rock</span>
                </div>

                <h1 className="event-title">El Mejor Evento de Rock en San Juan de Pasto</h1>

                <p className="event-description">
                    Uno de los festivales de musica alternativa más importantes del Suroccidente Colombiano
                </p>

                <div className="event-schedule">
                    <div className="schedule-item">
                        <div className="schedule-dot"></div>
                        <span className="schedule-text">Casa Cultural Antiguo Liceo - Universidad de Nariño</span>
                    </div>

                    <div className="schedule-item">
                        <div className="schedule-dot"></div>
                        <span className="schedule-text">29 / Agosto / 2025</span>
                    </div>

                    <div className="schedule-item">
                        <div className="schedule-dot"></div>
                        <span className="schedule-text">6:00 PM - 12:00 PM</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;