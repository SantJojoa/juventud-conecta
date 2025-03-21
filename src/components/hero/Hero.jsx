import React from "react";
import Carousel from "../carousel/carouselComponent";
import "./Hero.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="placeholder-content">
                <h1>Juventud Conecta</h1>
                <p>Descubre los últimos eventos que suceden en la ciudad sorpresa</p>
            </div>
            <Carousel />
        </section>
    )
};
export default Hero;