import React from 'react';
import './events_favorite_options.css';

function Events_favorite_options() {
  return (
    <div className="concerts-container">
      <div className="concerts-header">
        <h2>Eventos Pasto Joven</h2>
        <a href="#" className="view-all">Ver todo</a>
      </div>
      
      <div className="concerts-grid">
        <div className="concert-card">
          <div className="concert-image-container">
            <img src="/public/images/a22b2e18-092e-11ef-85ac-8e25b523fd66.avif" alt="Evento Joven: Tributo a Queen" className="concert-image" />
            <button className="favorite-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div className="overlay-text">
              <p className="fever-text">Pasto presenta</p>
              <h3 className="Evento Joven-text">Evento Joven</h3>
            </div>
          </div>
          <div className="venue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="venue-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Banco de la República - Pasto</span>
          </div>
          <h4 className="concert-title">Evento Joven: Tributo a Queen</h4>
          <div className="concert-date">22-may - 17-jun</div>
          <div className="concert-price">Desde COP 130,000.00</div>
        </div>

        <div className="concert-card">
          <div className="concert-image-container">
            <img src="/public/images/a22.avif" alt="Evento Joven: Tributo a Coldplay" className="concert-image" />
            <button className="favorite-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div className="overlay-text">
              <p className="fever-text">Pasto presenta</p>
              <h3 className="Evento Joven-text">Evento Joven</h3>
            </div>
          </div>
          <div className="venue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="venue-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Banco de la República - Pasto</span>
          </div>
          <h4 className="concert-title">Evento Joven: Tributo a Coldplay</h4>
          <div className="concert-date">06-may - 10-jun</div>
          <div className="concert-price">Desde COP 130,000.00</div>
        </div>

        <div className="concert-card">
          <div className="concert-image-container">
            <img src="/public/images/033.avif" alt="Evento Joven: Las Cuatro Estaciones de Vivaldi" className="concert-image" />
            <button className="favorite-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div className="overlay-text">
              <p className="fever-text">Pasto presenta</p>
              <h3 className="Evento Joven-text">Evento Joven</h3>
            </div>
          </div>
          <div className="venue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="venue-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Banco de la República - Pasto</span>
          </div>
          <h4 className="concert-title">Evento Joven: Las Cuatro Estaciones de Vivaldi</h4>
          <div className="concert-date">06-may - 11-jun</div>
          <div className="concert-price">Desde COP 130,000.00</div>
        </div>

        <div className="concert-card">
          <div className="concert-image-container">
            <img src="/public/images/a22b2e18-092e-11ef-85ac-8e25b523fd66.avif" alt="Evento Joven - Tarjeta Regalo" className="concert-image" />
            <button className="favorite-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div className="overlay-text">
              <h3 className="Evento Joven-text">Evento Joven</h3>
            </div>
          </div>
          <h4 className="concert-title">Evento Joven - Tarjeta Regalo</h4>
          <div className="concert-date">27-feb</div>
          <div className="concert-price">Desde COP 100,000.00</div>
        </div>
      </div>
    </div>
  );
}

export default Events_favorite_options;