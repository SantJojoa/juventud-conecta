import React, { useState } from 'react';
import { MapPin, Heart, User } from 'lucide-react';
import './FeverNavbar.css';
import { Link } from 'react-router-dom';

function FeverNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fever-header">
      <div className="navbar-container">
        <div className="location-section">
          <MapPin className="location-icon" />
          <span className="location-text">Pasto</span>
        </div>

        <div className="categories-section">
          <div className={`overlay ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}></div>
          <button className="categories-button" onClick={toggleDropdown}>
            Categorias
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <h2 className="dropdown-title">Categorias</h2>
              <h4>---------------</h4>
              <button className="dropdown-item">Musica</button>
              <button className="dropdown-item">Deporte</button>
              <button className="dropdown-item">Cultura</button>
              <button className="dropdown-item">Arte</button>
              <button className="dropdown-item">Tecnología</button>
            </div>
          )}
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