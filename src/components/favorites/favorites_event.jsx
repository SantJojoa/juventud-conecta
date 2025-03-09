import React from 'react';
import './favorites_event.css';
import FeverNavbar from '../fever_navBar/FeverNavbar';
import Events_favorite_options from '../events_favorite_options/events_favorite_options';
import Footer from '../footer/Footer';

function Favorites_event() {
    return (
        <div className="favorites-container">
            <FeverNavbar />
            <div className="header_favorites">
                <div className="illustration">
                    <img src="/public/images/favorites.png" alt="Persona con corazón" />
                </div>
                <div className="title_favorites">
                    <h1>Guarda los eventos que más te gustan en un solo lugar.</h1>
                </div>
            </div>

            <div className="content">
                <h2>Empieza a crear tu lista de favoritos</h2>
                <p>Inicia sesión para guardar y volver a visitar tus eventos favoritos en cualquier momento.</p>

                <div className="action">
                    <button className="login-button">Iniciar sesión</button>
                </div>
            </div>
            <Events_favorite_options />
            <Footer />
        </div>
    );
}

export default Favorites_event;