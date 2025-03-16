//Importes de react
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// Importes de componentes
import FeverNavbar from './components/fever_navBar/FeverNavbar';
import Carousel from "./components/carousel/carousel-component";
import EventDetails from './components/event_Details/EventDetails';
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Login = lazy(() => import('./pages/login/Login'));
const FavoritesEvent = lazy(() => import('./components/favorites/FavoritesEvent'));
import ViewMoreButton from './components/buttons/view_more_button/ViewMoreButton';
import Footer from './components/footer/Footer';
// Importes de datos
import eventsData from './data/eventsData';
//Importes de estilos
import './App.css';

function App() {

  return (
    <Router>
      <FeverNavbar />
      <main className='app-container content'>
        <Suspense fallback={<div>Cargando.....</div>}>
          <Routes>
            <Route path="/" element={
              <>
                <div className="placeholder-content">
                  <h1>Eventos - Juventud Pasto.</h1>
                  <p>Descubre los mejores eventos.</p>
                </div>
                <Carousel />
                {eventsData.map((event, index) => (
                  <EventDetails key={index} {...event} />
                ))}
                <ViewMoreButton />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/favorites" element={<FavoritesEvent />} />
            <Route path="/event/:id" element={<EventDetail />} />
          </Routes>
        </Suspense>

      </main>
      <Footer />
    </Router>
  );
}

export default App;