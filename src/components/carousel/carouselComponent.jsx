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

    const handleClick = useCallback((id) => {
        navigate(`/event/${id}`);
    }, [navigate]);

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
                                onClick={() => handleClick(event._id)}
                                style={{ cursor: "pointer" }}
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
        </div>
    );
};

export default Carousel;
