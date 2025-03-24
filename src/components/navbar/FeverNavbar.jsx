import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Heart, User } from 'lucide-react';
import './FeverNavbar.css';
import { Link, useNavigate } from 'react-router-dom';

function FeverNavbar() {
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const socialDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleSocialDropdown = useCallback(() => {
    setIsSocialDropdownOpen((prev) => !prev);
  }, []);

  const closeDropdowns = useCallback((event) => {
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

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate('/events');
      }
    }
  };

  return (
    <nav className="fever-navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <Link to="/">
            <img src="/logo.png" alt="logo-oficinajuventud" className="navbar-logo" />
          </Link>
        </div>

        <div ref={socialDropdownRef} className="social-section" onMouseOver={toggleSocialDropdown} onMouseOut={toggleSocialDropdown}>
          <button
            className="social-button"
            aria-expanded={isSocialDropdownOpen}
          >
            Redes/Páginas
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
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
