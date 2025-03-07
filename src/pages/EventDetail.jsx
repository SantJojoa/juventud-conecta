import React from "react";
import { useParams } from "react-router-dom";

const eventDetails = {
    1: { title: "En Nariño, Pasto es Hip Hop", date: "31 Mayo", description: "Un evento dedicado a la cultura Hip Hop en Pasto." },
    2: { title: "Galeras 1", date: "Próximamente", description: "Explora la majestuosidad del Volcán Galeras." },
    3: { title: "Evento 3", date: "Fecha por definir", description: "Un evento cultural imperdible." },
    4: { title: "Evento 4", date: "Fecha por definir", description: "Otro gran evento en la ciudad." },
    5: { title: "Semana de la Juventud 2023", date: "Agosto 2023", description: "Un espacio para los jóvenes con actividades, talleres y conciertos." }
};

const EventDetail = () => {
    const { id } = useParams();
    const event = eventDetails[id];

    if (!event) {
        return <h2>Evento no encontrado</h2>;
    }

    return (
        <div className="event-detail">
            <h1>{event.title}</h1>
            <p><strong>Fecha:</strong> {event.date}</p>
            <p>{event.description}</p>
        </div>
    );
};

export default EventDetail;
