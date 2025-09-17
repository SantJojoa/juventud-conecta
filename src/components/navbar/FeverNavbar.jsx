import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import './FeverNavbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotificationService } from '../../services/notificationService';

function FeverNavbar() {
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const [isOtherPagesDropdownOpen, setIsOtherPagesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [scrollDirection, setScrollDirection] = useState('');
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const socialDropdownRef = useRef(null);
  const otherPagesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const notifRef = useRef(null);

  const isHomePage = location.pathname === '/';


  useEffect(() => {
    const load = async () => {
      if (!localStorage.getItem('token')) return;
      try {
        const res = await NotificationService.list();
        const list = res.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.read).length);
      } catch (e) {
        console.error('Error al obtener notificaciones:', e);
      }
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotiOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (isHomePage) {
        if (scrollTop === 0) {
          setScrollDirection('');
        } else if (scrollTop > lastScrollTop && scrollTop > 50) {
          setScrollDirection('down');
        } else if (scrollTop < lastScrollTop) {
          setScrollDirection('up');
        }
      } else {
        setScrollDirection('not-home');
      }
      setLastScrollTop(scrollTop);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedFirstName = localStorage.getItem('firstName');
      const storedLastName = localStorage.getItem('lastName');
      const storedUserRole = localStorage.getItem('userRole');
      const storedProfileImage = localStorage.getItem('profileImage');
      console.log('Checking auth:', { token, storedFirstName, storedLastName, storedUserRole, storedProfileImage })

      if (token && (storedFirstName || storedLastName)) {
        setIsLoggedIn(true);
        setFirstName(storedFirstName || '');
        setLastName(storedLastName || '');
        setUserRole(storedUserRole || '');
        setProfileImage(storedProfileImage || '');
        console.log('User is logged in:', {
          firstName: storedFirstName,
          lastName: storedLastName,
          role: storedUserRole,
          hasProfileImage: !!storedProfileImage
        });
      } else {
        setIsLoggedIn(false);
        setFirstName('');
        setLastName('');
        setUserRole('');
        setProfileImage('');
      }
    };

    checkAuth();

    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData.avatarUrl) {
            setProfileImage(userData.avatarUrl);
            localStorage.setItem('profileImage', userData.avatarUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();

    const handleLoginChange = () => {
      console.log('Login change event detected');
      checkAuth();
      fetchProfileImage();
    };

    window.addEventListener('storage', checkAuth);
    window.addEventListener('login-change', handleLoginChange);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('login-change', handleLoginChange);
    };
  }, []);

  const getUserInitials = () => {
    if (!firstName && !lastName) return '';

    if (firstName && !lastName) {
      return firstName.charAt(0).toUpperCase();
    }

    if (!firstName && lastName) {
      return lastName.charAt(0).toUpperCase();
    }

    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileImage');
    setIsLoggedIn(false);
    setFirstName('');
    setLastName('');
    setUserRole('');
    setProfileImage('');
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);

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

  const toggleOtherPagesDropdown = () => {
    setIsOtherPagesDropdownOpen((prev) => !prev);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }

      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
        setIsSocialDropdownOpen(false);
      }

      if (otherPagesDropdownRef.current && !otherPagesDropdownRef.current.contains(event.target)) {
        setIsOtherPagesDropdownOpen(false);
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

  const handleSuggestionClick = (eventId) => {
    setSearchTerm("");
    navigate(`/event/${eventId}`);
    setShowSuggestions(false);
  };

  return (
    <nav className={`fever-navbar ${scrollDirection === 'down' ? 'navbar-scrolled-down' : scrollDirection === 'up' || !isHomePage || scrollDirection === 'not-home' ? 'navbar-scrolled-up' : ''}`}>
      <div className="navbar-container">
        <div className="logo-section">
          <Link to="/">
            {scrollDirection === 'up' || !isHomePage || scrollDirection === 'not-home' ? (
              <img src="/logo-final-improved.png" alt="logo-oficinajuventud" className="navbar-logo" />
            ) : (
              <img src="/white-logo-final-improved.png" alt="logo-oficinajuventud" className="navbar-logo" />
            )}
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
                      onClick={() => handleSuggestionClick(event._id, event.title)}
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

          <div ref={otherPagesDropdownRef} className="social-section" onMouseOver={toggleOtherPagesDropdown} onMouseOut={toggleOtherPagesDropdown}>
            <button
              className="social-button"
              aria-expanded={isOtherPagesDropdownOpen}
            >
              Otras Paginas
            </button>
            {isOtherPagesDropdownOpen && (
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

          <div ref={notifRef} className="notifications-section">
            <button className="notif-button" onClick={() => setIsNotiOpen(prev => !prev)} aria-label="Notificaciones">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 24a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 24Zm7.2-6v-5.4a7.2 7.2 0 0 0-6-7.08V4.8a1.2 1.2 0 1 0-2.4 0v.72a7.2 7.2 0 0 0-6 7.08V18L3.6 19.2V20.4h16.8V19.2L19.2 18Z" /></svg>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            {isNotiOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && <button onClick={async () => { await NotificationService.markAllRead(); setNotifications(n => n.map(x => ({ ...x, read: true }))); setUnreadCount(0); }}>Marcar todas como leídas</button>}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">Sin notificaciones</div>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={async () => {
                      if (!n.read) {
                        await NotificationService.markRead(n.id);
                        setNotifications(list => list.map(x => x.id === n.id ? { ...x, read: true } : x));
                        setUnreadCount(c => Math.max(0, c - 1));
                      }
                    }}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-date">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
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
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Foto de perfil"
                      className='profile-image'
                    />
                  ) : (
                    getUserInitials()
                  )}
                </div>
              </button>
              {isUserDropdownOpen && (
                <div
                  ref={userDropdownRef}
                  className="user-dropdown"
                >
                  <div className="user-info">
                    {profileImage && (
                      <div className='dropdown-profile-image-container'>
                        <img
                          src={profileImage}
                          alt="Foto de perfil"
                          className='dropdown-profile-image'
                        />
                      </div>
                    )}
                    <div className="user-name">{firstName} {lastName}</div>
                    {userRole === 'admin' && (
                      <div className="user-info-role">
                        Rol: Administrador
                      </div>
                    )}
                  </div>
                  <div className="divider"></div>
                  <Link className='profile-link'
                    to="/profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>
                  <Link
                    className='favorites-link'
                    to="/favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>Eventos Favoritos</span>
                  </Link>
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
    </nav >
  );
}

export default FeverNavbar;