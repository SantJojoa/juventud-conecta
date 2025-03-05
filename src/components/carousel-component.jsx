"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";
const images = [
    "/public/mocks/En Nariño, Pasto es Hip Hop 31 MAYO.jpg",
    "/public/mocks/Galeras 1.jpeg",
    "/public/mocks/images (1).jpeg",
    "/public/mocks/images (2).jpeg",
    "/public/mocks/semana_de_la_juventud_2023_pg1.jpg"
]

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };
    return (
        <div className="carousel-wrapper">
            <div className="carousel-container">
                <Slider {...settings}>
                    {images.map((src, index) => (
                        <div key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} className="carousel-image" />
                        </div>
                    ))}
                </Slider>
            </div>

        </div>

    );
};


export default Carousel;
