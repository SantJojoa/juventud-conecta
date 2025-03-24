import React, { useState, useRef, useEffect } from 'react';
import { Heart, User, LogOut } from 'lucide-react';
import './FeverNavbar.css';
import { Link, useNavigate } from 'react-router-dom';

function FeverNavbar() {
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const socialDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');

    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setUserRole(storedUserRole || '');
    }
  }, []);


  const getUserInitials = () => {
    if (!userName) return '';
    const nameParts = userName.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    setIsUserDropdownOpen(false);
    navigate('/');
  };


  // Implementación del debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200); // 200ms de retraso

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setAllEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching events for search suggestions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Utilizamos el término de búsqueda con debounce para filtrar
  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ).slice(0, 5);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, allEvents]);

  const toggleSocialDropdown = () => {
    setIsSocialDropdownOpen((prev) => !prev);
  };

  // Método simple para alternar el menú
  const toggleUserDropdown = () => {
    // Simplemente invertir el estado actual
    setIsUserDropdownOpen(prevState => !prevState);
  };

  // Efecto para manejar clic fuera de los elementos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }

      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
        setIsSocialDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
        setShowSuggestions(false);
      } else {
        navigate('/events');
      }
    }
  };

  const handleSuggestionClick = (eventTitle) => {
    setSearchTerm(eventTitle);
    navigate(`/events?search=${encodeURIComponent(eventTitle)}`);
    setShowSuggestions(false);
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

        <div className="search-section" ref={searchRef}>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Descubre Eventos"
              className="search-input"
              aria-label="Buscar eventos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
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
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {isLoading ? (
                  <div className="suggestion-item loading">Cargando sugerencias...</div>
                ) : (
                  suggestions.map((event) => (
                    <div
                      key={event._id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(event.title)}
                    >
                      {event.title}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="actions-section">
          <Link to="/favorites">
            <button className="action-button" aria-label="Ver favoritos">
              <Heart className="action-icon" />
            </button>
          </Link>


          {isLoggedIn ? (
            <div className="user-section" style={{ position: 'relative' }}>
              <button
                className='user-avatar-button'
                onClick={toggleUserDropdown}
                aria-label='Menu de usuario'
                type="button"
              >
                <div className="user-avatar">
                  {getUserInitials()}
                </div>
              </button>

              {/* Menú desplegable con estilos en línea para asegurar visibilidad */}
              {isUserDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    width: '200px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '12px',
                    zIndex: 9999,
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{userName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                      Rol: {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                    </div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 0' }}></div>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      cursor: 'pointer',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    type="button"
                  >
                    <LogOut size={16} style={{ color: '#e53e3e' }} />
                    <span style={{ color: '#e53e3e' }}>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="action-button" aria-label="Iniciar sesión">
                <User className="action-icon" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default FeverNavbar;
