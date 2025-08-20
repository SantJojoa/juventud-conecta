import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";

import { useEvents } from "../../hooks/useEvents";


import LoadingIndicator from "../shared/LoadingIndicator";
import EmptyStateMessageComponent from "../shared/EmptyStateMessage";



const Carousel = ({ onImageChange }) => {


    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';

        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long' };
        return date.toLocaleDateString('es-CO', options);
    }

    const { events, loading } = useEvents();
    const [currentSlide, setCurrentSlide] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (events.length > 0 && events[currentSlide]) {
            onImageChange && onImageChange(events[currentSlide].imageSrc);
        }
    }, [currentSlide, events, onImageChange]);

    const settings = {
        dots: true,
        infinite: events.length > 1,
        speed: 80,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: events.length > 1,
        autoplaySpeed: 2500,
        adaptiveHeight: true,
        arrows: events.length > 1,
        beforeChange: (current, next) => setCurrentSlide(next)
    };

    if (loading) {
        return <div className="carousel-wrapper"><LoadingIndicator /></div>
    }



    if (events.length === 0) {
        return (
            <div className="carousel-wrapper">
                <div className="carousel-container">
                    <EmptyStateMessageComponent />
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
                                onClick={() => navigate(`/event/${event._id}`)}
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
                                    <p> 📅 Desde : {formatDate(event.startDate) || 'Fecha no disponible'} | Hasta : {formatDate(event.endDate) || 'Fecha no disponible'}</p>
                                    <p>📍 {event.location || 'Ubicación no disponible'}</p>
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

