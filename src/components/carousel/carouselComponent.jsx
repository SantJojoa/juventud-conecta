import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
import { useState } from "react";
import { useEffect } from "react";

const Carousel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const settings = {
        dots: true,
        infinite: events.length > 1,
        speed: 80,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: events.length > 1,
        autoplaySpeed: 2500,
        adaptiveHeight: true,
        arrows: events.length > 1
    };


    const openEventPopup = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    const closeEventPopup = useCallback(() => {
        setSelectedEvent(null);
    }, []);

    if (loading) {
        return <div className="carousel-wrapper">Cargando eventos...</div>;
    }

    if (events.length === 0) {
        return (
            <div className="carousel-wrapper">
                <div className="carousel-container">
                    <div className="no-events-message">
                        No hay eventos disponibles
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="carousel-wrapper">
            <div className="carousel-container">
                <Slider {...settings}>
                    {events.map((event) => {
                        if (!event || !event._id) return null;
                        return (
                            <div
                                key={event._id}
                                onClick={() => openEventPopup(event)}
                                className="carousel-slide-item"
                                aria-label={`Ver detalles del evento ${event.title || ''}`}
                            >
                                <img
                                    src={event.imageSrc}
                                    alt={event.title || 'Imagen del evento'}
                                    className="carousel-image"
                                />
                                <div className="carousel-caption">
                                    <h3>{event.title || 'Sin título'}</h3>
                                    <p>{event.date || 'Fecha no disponible'}</p>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>

            {selectedEvent && (

                <div className="event-popup-overlay" onClick={closeEventPopup}>
                    <div className="event-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="close-popup" onClick={closeEventPopup}>
                            &times;
                        </button>
                        <div className="popup-image-container">
                            <img src={selectedEvent.imageSrc} alt={selectedEvent.title} className="popup-image"
                            />
                        </div>
                        <div className="popup-content">
                            <h2 className="popup-title">{selectedEvent.title}</h2>
                            <p className="popup-date">
                                <strong>Fecha:</strong>{" "}
                                {new Date(selectedEvent.date).toLocaleDateString()}
                            </p>
                            <p className="popup-location">
                                <strong>Ubicación:</strong> {selectedEvent.location || 'Ubicación no disponible'}
                            </p>
                            <p className="popup-description">
                                {selectedEvent.description || 'Descripción no disponible'}
                            </p>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default Carousel;
