<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
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
                <p>Descubre los últimos eventos que suceden en la ciudad sorpresa</p>
            </div>
<<<<<<< HEAD
            <Carousel />
=======
            <Carousel onImageChange={handleImageChange} />
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
            <div className="btn-container">
                <Link to="/events" className="ver-eventos-btn"> Ver todos los eventos</Link>
            </div>
        </section>
    )
};
export default Hero;