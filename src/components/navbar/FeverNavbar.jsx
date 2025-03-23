import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Heart, User } from 'lucide-react';
import './FeverNavbar.css';
import { Link } from 'react-router-dom';

function FeverNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const socialDropdownRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
    setIsSocialDropdownOpen(false);
  }, []);

  const toggleSocialDropdown = useCallback(() => {
    setIsSocialDropdownOpen((prev) => !prev);
    setIsDropdownOpen(false);
  }, []);

  const closeDropdowns = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
      setIsSocialDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdowns);
    return () => {
      document.removeEventListener("mousedown", closeDropdowns);
    };
  }, [closeDropdowns]);

  const categories = ["Música", "Deporte", "Cultura", "Arte", "Tecnología"];

  return (
    <nav className="fever-navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <Link to="/">
            <img src="/logo.png" alt="logo-oficinajuventud" className="navbar-logo" />
          </Link>
        </div>

        <div ref={dropdownRef} className="categories-section">
          <button
            className="categories-button"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            Categorías
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu" role="menu">
              <h2 className="dropdown-title">Categorías</h2>
              <h4>---------------</h4>
              {categories.map((category) => (
                <button key={category} className="dropdown-item">
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={socialDropdownRef} className="social-section">
          <button
            className="social-button"
            onClick={toggleSocialDropdown}
            aria-expanded={isSocialDropdownOpen}
          >
            Redes Sociales
          </button>
          {isSocialDropdownOpen && (
            <div className="dropdown-menu social-dropdown" role="menu">
              <a href="https://www.facebook.com/direcciondejuventudpasto" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                Facebook
              </a>
              <a href="https://www.instagram.com/juventudpasto/" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                Instagram
              </a>
              <a href="https://twitter.com/juventudpasto" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                X
              </a>
              <h2 className="dropdown-title">Enlaces</h2>
              <a href="https://www.pasto.gov.co" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                Alcaldía de Pasto
              </a>
              <a href="https://observatoriojuventud.pasto.gov.co/inicio" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                Observatorio
              </a>
            </div>
          )}
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Descubre Eventos"
              className="search-input"
              aria-label="Buscar eventos"
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
          <Link to="/favorites">
            <button className="action-button" aria-label="Ver favoritos">
              <Heart className="action-icon" />
            </button>
          </Link>

          <Link to="/login">
            <button className="action-button" aria-label="Iniciar sesión">
              <User className="action-icon" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default FeverNavbar;
