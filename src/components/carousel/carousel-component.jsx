"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
const images = [
    { id: 1, src: "/mocks/En Nariño, Pasto es Hip Hop 31 MAYO.jpg" },
    { id: 2, src: "/mocks/Galeras 1.jpeg" },
    { id: 3, src: "/mocks/images (1).jpeg" },
    { id: 4, src: "/mocks/images (2).jpeg" },
    { id: 5, src: "/mocks/semana_de_la_juventud_2023_pg1.jpg" }
]

const Carousel = () => {

    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 80,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
    };

    const handleClick = (id) => {
        navigate(`/event/${id}`);
    }
    return (
        <div className="carousel-wrapper">
            <div className="carousel-container">
                <Slider {...settings}>
                    {images.map((image) => (
                        <div key={image.id} onClick={() => handleClick(image.id)} style={{ cursor: "pointer" }}>
                            <img src={image.src} alt={`Evento ${image.id}`} className="carousel-image" />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};


export default Carousel;
