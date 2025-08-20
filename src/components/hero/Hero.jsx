import React, { useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../carousel/carouselComponent";
import "./Hero.css";

const Hero = () => {
    const [currentImage, setCurrentImage] = useState("");

    const handleImageChange = (imageSrc) => {
        setCurrentImage(imageSrc);
    };

    const heroStyle = {
        "--hero-background-image": currentImage ? `url(${currentImage})` : "none"
    }
    return (
        <section className="hero" style={heroStyle}>
            <div className="placeholder-content">
                <h1>Juventud Conecta</h1>
                <p>Descubre los últimos eventos que suceden en la ciudad sorpresa ....</p>
            </div>
            <Carousel onImageChange={handleImageChange} />
            <div className="btn-container">
                <Link to="/events" className="ver-eventos-btn"> Ver todos los eventos</Link>
            </div>
        </section>
    )
};
export default Hero;