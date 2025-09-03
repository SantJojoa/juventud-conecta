import React from "react";
import { useNavigate } from "react-router-dom";
import EventCalendar from "./EventCalendar/EventCalendar";

import Hero from "./Hero/Hero";
import WorkLines from '../components/other_events/workLines'





function HomePage() {
    return (
        <div className="home-page-container">
            <Hero />
            <EventCalendar />
            <WorkLines />

        </div>
    );
}

export default HomePage;