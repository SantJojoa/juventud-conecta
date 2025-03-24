import React from "react";
import { Link } from "react-router-dom";
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
            <div className="btn-container">
                <Link to="/events" className="ver-eventos-btn"> Ver todos los eventos</Link>
            </div>
        </section>
    )
};
export default Hero;