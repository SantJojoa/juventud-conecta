import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";

import { useEvents } from "../../hooks/useEvents";
import { RecommendationService } from "../../services/recommendationService";
import { AuthService } from "../../services/authService";


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
    const [orderedEvents, setOrderedEvents] = useState([]);
    const [recommended, setRecommended] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (orderedEvents.length > 0 && orderedEvents[currentSlide]) {
            onImageChange && onImageChange(orderedEvents[currentSlide].imageSrc);
        }
    }, [currentSlide, orderedEvents, onImageChange]);

    useEffect(() => {
        const loadRecommendationAndOrder = async () => {
            try {
                let rec = null;
                if (AuthService.isAuthenticated()) {
                    const token = AuthService.getToken();
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const userId = payload?.id;
                    if (userId) {
                        const recs = await RecommendationService.getForUser(userId);
                        rec = Array.isArray(recs) && recs.length > 0 ? recs[0] : null;
                        setRecommended(rec);
                    }
                }

                // Encontrar el más próximo (startDate >= hoy)
                const todayStr = new Date().toISOString().slice(0, 10);
                const upcoming = events
                    .filter(e => e?.startDate >= todayStr)
                    .sort((a, b) => a.startDate.localeCompare(b.startDate));
                const nextEvent = upcoming[0] || null;

                // Construir orden: [próximo], [recomendado si distinto], resto
                const seen = new Set();
                const result = [];
                if (nextEvent) {
                    result.push({ ...nextEvent, __badge: 'Próximo evento' });
                    seen.add(nextEvent._id);
                }
                if (rec && !seen.has(rec.id) && !seen.has(rec._id)) {
                    // normalizar id de backend/frontend
                    const found = events.find(e => e._id === rec.id || e._id === rec._id);
                    if (found) {
                        result.push({ ...found, __badge: 'Evento recomendado' });
                        seen.add(found._id);
                    }
                }
                for (const e of events) {
                    if (!e || !e._id || seen.has(e._id)) continue;
                    result.push(e);
                }
                setOrderedEvents(result);
                setCurrentSlide(0);
            } catch (err) {
                // Si falla la recomendación, al menos ordenar por próximo
                const todayStr = new Date().toISOString().slice(0, 10);
                const upcoming = events
                    .filter(e => e?.startDate >= todayStr)
                    .sort((a, b) => a.startDate.localeCompare(b.startDate));
                const nextEvent = upcoming[0] || null;
                const seen = new Set();
                const result = [];
                if (nextEvent) { result.push({ ...nextEvent, __badge: 'Próximo evento' }); seen.add(nextEvent._id); }
                for (const e of events) { if (e?._id && !seen.has(e._id)) result.push(e); }
                setOrderedEvents(result);
            }
        };
        if (events && events.length) loadRecommendationAndOrder();
    }, [events]);

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
                    {orderedEvents.map((event) => {
                        if (!event || !event._id) return null;
                        return (
                            <div
                                key={event._id}
                                onClick={() => navigate(`/event/${event._id}`)}
                                className="carousel-slide-item"
                                aria-label={`Ver detalles del evento ${event.title || ''}`}
                            >
                                {event.__badge && (
                                    <span className="carousel-badge">{event.__badge}</span>
                                )}
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

