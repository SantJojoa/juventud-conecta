import React from 'react';
import { MapPin, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function FeverNavbar() {
  return (
    <header className="fever-header">
      <div className="navbar-container">
        <div className="location-section">
          <MapPin className="location-icon" />
          <span className="location-text">Pasto</span>
        </div>

        <div className="categories-section">
          <button className="categories-button">Categorias</button>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Descubre Eventos"
              className="search-input"
            />
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="actions-section">
          <Link>
            <button className="action-button">
              <Heart className="action-icon" />
            </button>
          </Link>

          <Link to="/src/components/login/Login.jsx">
            <button className="action-button">
              <User className="action-icon" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default FeverNavbar;