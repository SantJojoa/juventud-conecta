import React from 'react';
import FeverNavbar from './components/FeverNavbar';
import Carousel from "./components/carousel-component"
import './components/FeverNavbar.css';

function App() {
  return (
    <div className="app-container">
      <FeverNavbar />
      <main className="content">
        <div className="placeholder-content">
          <h1>Bienvenido a _________</h1>
          <p>Descubre los mejores eventos </p>
        </div>
      </main>

      <div><Carousel /></div>
      
    </div>
  );
}

export default App;
