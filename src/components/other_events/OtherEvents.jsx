import React from "react";
import MoreEvents from "../more_events/MoreEvents";
import eventsData from "../../data/eventsData";
import ViewMoreButton from "../buttons/ViewMoreButton";
import "./OtherEvents.css";

function OtherEvents() {
    return (
        <section className="other-events-container">
            <div className="title">
                <h2>Explora mas eventos</h2>
            </div>
            {eventsData.map((event, index) => (
                <MoreEvents
                    key={index}
                    imageSrc={event.imageSrc}
                    altText={event.altText}
                    tag={event.tag}
                    title={event.title}
                    description={event.description}
                    schedule={event.schedule}
                />


            ))}
            <ViewMoreButton />
        </section>
    );
}
export default OtherEvents;