import React from 'react';
import './EventDetails.css';

function EventDetails({ imageSrc, altText, tag, title, description, schedule }) {
    return (
        <div className="event-container">
            <div className="event-image-wrapper difuminar-imagen">
                <img
                    src={imageSrc}
                    alt={altText}
                    className="event-image"
                />
            </div>

            <div className="event-info-card">
                <div className="event-info-header">
                    <span className="event-tag">{tag}</span>
                </div>

                <h1 className="event-title">{title}</h1>

                <p className="event-description">{description}</p>

                <div className="event-schedule">
                    {schedule.map((item, index) => (
                        <div className="schedule-item" key={index}>
                            <div className="schedule-dot"></div>
                            <span className="schedule-text">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventDetails;