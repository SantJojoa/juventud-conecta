import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";

import { useEvents } from "../../hooks/useEvents";
import { useEventPopup } from "../../hooks/useEventPopup";


import LoadingIndicator from "../shared/LoadingIndicator";
import EmptyStateMessageComponent from "../shared/EmptyStateMessage";
import EventPopUp from "../shared/EventPopup";



const Carousel = () => {

    const { events, loading } = useEvents();
    const { selectedEvent, openEventPopup, closeEventPopup } = useEventPopup();

    const navigate = useNavigate();


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

            {selectedEvent && <EventPopUp event={selectedEvent} onClose={closeEventPopup} />}

        </div>
    );
};

export default Carousel;

