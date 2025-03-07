import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeverNavbar from './components/fever_navBar/FeverNavbar';
import './components/fever_navBar/FeverNavbar.css';
import Carousel from "./components/carousel/carousel-component";
import Login from './pages/login/Login';
import EventDetails from './components/event_Details/EventDetails';
import Footer from './components/footer/Footer';
import ViewMoreButton from './components/buttons/view_more_button/ViewMoreButton';

function App() {
  const event1 = {
    imageSrc: "../public/images/galeras_rock.webp",
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
    imageSrc: "../public/images/semana_de_la_juventud_2023.webp",
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
    imageSrc: "../public/images/pasto_HipHop.webp",
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
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app-container content">
            <FeverNavbar />
            <main>
              <div className="placeholder-content">
                <h1>Eventos - Juventud Pasto.</h1>
                <p>Descubre los mejores eventos.</p>
              </div>
              <Carousel />
              <h1 className='placeholder-content'>__________________</h1>
              <EventDetails {...event1} />
              <EventDetails {...event2} />
              <EventDetails {...event3} />
              <ViewMoreButton />
              <h1 className='placeholder-content'>__________________</h1>
            </main>
            <Footer />
          </div>
        } />
        <Route path="/src/components/login/Login.jsx" element={<Login />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;