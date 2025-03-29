import React from "react";
import { useNavigate } from "react-router-dom";

import Hero from "./Hero/Hero";
import OtherEvents from "./other_events/OtherEvents";

function HomePage() {
    return (
        <div className="home-page-container">
            <Hero />
            <OtherEvents />
        </div>
    );
}

export default HomePage;