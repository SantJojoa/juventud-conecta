import React from 'react';
import FeverNavbar from './components/FeverNavbar';
import './components/FeverNavbar.css';
import Carousel from "./components/carousel-component"
import EventDetails from './components/EventDetails';
//import EventDetails2 from './components/EventDetails2';

function App() {
  return (
    <div className="app-container">
      <FeverNavbar />
      <main className="content">
        <div className="placeholder-content">
          <h1>Bienvenido a _______.</h1>
          <p>Descubre los mejores eventos. </p>
        </div>
      </main>
      <div><Carousel /></div>
      <h1 className='placeholder-content'>__________________</h1>
      <div><EventDetails /></div>
    </div>
  );
}

export default App;
