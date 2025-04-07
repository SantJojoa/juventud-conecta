import React from "react";
import { useNavigate } from "react-router-dom";

import Hero from "./Hero/Hero";
import WorkLines from '../components/other_events/workLines'





function HomePage() {
    return (
        <div className="home-page-container">
            <Hero />
            <WorkLines />
        </div>
    );
}

export default HomePage;