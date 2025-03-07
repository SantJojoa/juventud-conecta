import React from 'react';
import FeverNavbar from './components/FeverNavbar';
import './components/FeverNavbar.css';
import Carousel from "./components/carousel-component"
import EventDetails from './components/EventDetails';
import Footer from './components/Footer';
import ViewMoreButton from './components/ViewMoreButton';

function App() {
  const event1 = {
    imageSrc: "/src/image/galerasRock.webp",
    altText: "Galeras Rock",
    tag: "Galeras Rock",
    description: "Uno de los festivales de musica alternativa más importantes del Suroccidente Colombiano",
    schedule: [
      "Casa Cultural Antiguo Liceo - Universidad de Nariño",
      "29 / Agosto / 2025",
      "6:00 PM - 12:00 PM"
    ]
  };

  const event2 = {
    imageSrc: "/src/image/semana_de_la_juventud_2023.webp",
    altText: "Semana de la Juventud",
    tag: "Semana de la Juventud",
    description: "La Semana de la Juventud es un evento que se realiza en la ciudad de Pasto, con el fin de promover la participación de los jóvenes en la vida social, cultural, política y económica de la ciudad.",
    schedule: [
      "Plaza de Nariño",
      "11 / Septiembre / 2025",
      "2:00 PM - 8:00 PM"
    ]
  };

  const event3 = {
    // pasto Hip Hop
    imageSrc: "/src/image/pasto-HipHop.webp",
    altText: "Pasto Hip Hop",
    tag: "Pasto Hip Hop",
    description: "Pasto Hip Hop es un evento que reúne a los mejores exponentes del Hip Hop en la ciudad de Pasto.",
    schedule: [
      "Banco de la República",
      "31 / Mayo / 2025",
      "1:00 PM - 6:00 PM"
    ]
  };

  return (
    <div className="app-container content">
      <FeverNavbar />
      <main className="">
        <div className="placeholder-content">
          <h1>Eventos - Juventud Pasto.</h1>
          <p>Descubre los mejores eventos. </p>
        </div>
        <div><Carousel /></div>
        <h1 className='placeholder-content'>__________________</h1>
        <EventDetails {...event1} />
        <EventDetails {...event2} />
        <EventDetails {...event3} />
        <ViewMoreButton />
        <h1 className='placeholder-content'>__________________</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
