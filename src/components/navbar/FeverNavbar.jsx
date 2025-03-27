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
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      const storedUserRole = localStorage.getItem('userRole');

      if (token && storedUserName) {
        setIsLoggedIn(true);
        setUserName(storedUserName);
        setUserRole(storedUserRole || '');
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('login-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('login-change', checkAuth);
    };
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
            <img src="/logo-final-improved.png" alt="logo-oficinajuventud" className="navbar-logo" />
          </Link>
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
          <div ref={socialDropdownRef} className="social-section" onMouseOver={toggleSocialDropdown} onMouseOut={toggleSocialDropdown}>
            <button
              className="social-button"
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
              </div>
            )}
          </div>

          <div ref={socialDropdownRef} className="social-section" onMouseOver={toggleSocialDropdown} onMouseOut={toggleSocialDropdown}>
            <button
              className="social-button"
              aria-expanded={isSocialDropdownOpen}
            >
              Otras Paginas
            </button>
            {isSocialDropdownOpen && (
              <div className="dropdown-menu social-dropdown" role="menu">
                <a href="https://www.pasto.gov.co" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                  Alcaldía de Pasto
                </a>
                <a href="https://observatoriojuventud.pasto.gov.co/inicio" target="_blank" rel="noopener noreferrer" className="dropdown-item social-item">
                  Observatorio
                </a>
              </div>
            )}
          </div>




          {isLoggedIn ? (
            <div className="user-section">
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
              {isUserDropdownOpen && (
                <div
                  ref={userDropdownRef}
                  className="user-dropdown"
                >
                  <div className="user-info">
                    <div className="user-name">{userName}</div>
                    <div className="user-info-role">
                      Rol: {userRole === 'admin' ? 'Administrador' : 'Usuario'}
                    </div>
                  </div>
                  <div className="divider"></div>
                  {userRole === 'admin' && (
                    <>
                      <Link className='admin-link'
                        to="/admin-dashboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M9 3v18" />
                          <path d="M14 8h.01" />
                          <path d="M14 12h.01" />
                          <path d="M14 16h.01" />
                        </svg>
                        <span>Ir al Dashboard</span>
                      </Link>
                      <div className="divider"></div>
                    </>
                  )}
                  <div className="logout-item">

                    <button className='logout-button'
                      onClick={handleLogout}
                      aria-label="Cerrar sesión"
                      type="button"
                    >
                      <LogOut className="logout-icon" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
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
