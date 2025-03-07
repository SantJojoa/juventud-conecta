import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeverNavbar from './components/FeverNavbar';
import './components/FeverNavbar.css';
import Carousel from "./components/carousel-component";
import EventDetails from './components/EventDetails';
import Footer from './components/Footer';
import ViewMoreButton from './components/ViewMoreButton';

function App() {
  const event1 = {
    imageSrc: "/src/image/galerasRock.webp",
    altText: "Galeras Rock",
    tag: "Galeras Rock",
    description: "Uno de los festivales de música alternativa más importantes del Suroccidente Colombiano",
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
    description: "Evento en Pasto que promueve la participación juvenil.",
    schedule: [
      "Plaza de Nariño",
      "11 / Septiembre / 2025",
      "2:00 PM - 8:00 PM"
    ]
  };

  const event3 = {
    imageSrc: "/src/image/pasto-HipHop.webp",
    altText: "Pasto Hip Hop",
    tag: "Pasto Hip Hop",
    description: "Evento que reúne a los mejores exponentes del Hip Hop en Pasto.",
    schedule: [
      "Banco de la República",
      "31 / Mayo / 2025",
      "1:00 PM - 6:00 PM"
    ]
  };

  return (
    <Router> { }
      <div className="app-container content">
        <FeverNavbar />
        <main>
          <div className="placeholder-content">
            <h1>Eventos - Juventud Pasto.</h1>
            <p>Descubre los mejores eventos.</p>
          </div>

          <Routes> {/* ✅ Mueve las rutas aquí */}
            <Route path="/" element={<Carousel />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>

          <h1 className='placeholder-content'>__________________</h1>
          <EventDetails {...event1} />
          <EventDetails {...event2} />
          <EventDetails {...event3} />
          <ViewMoreButton />
          <h1 className='placeholder-content'>__________________</h1>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
