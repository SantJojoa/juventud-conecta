import React from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';


const AdminDashboard = () => {
    const adminName = localStorage.getItem("userName") || 'Administrador';
    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Panel de Administración</h1>
                <p className="welcome-message">Bienvenido(a), <strong>{adminName}</strong></p>
            </div>

            <div className="admin-cards-container">
                <div className="admin-card">
                    <div className="card-icon create-icon">
                        <svg xmlns="http://www.w3.org/200/svg0" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2>Crear Evento</h2>
                    <p>Añade nuevos eventos a la plataforma con toda la información necesaria.</p>
                    <Link to='/create-event' className="admin-btn">
                        Crear Nuevo Evento
                    </Link>
                </div>
                <div className="admin-card">
                    <div className="card-icon view-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
<<<<<<< HEAD
                    <h2>Ver Eventos</h2>
=======
                    <h2>Ve o Editar Eventos</h2>
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
                    <p>Visualiza todos los eventos disponibles en la plataforma.</p>
                    <Link to='/events' className="admin-btn" >
                        Ver Todos los Eventos
                    </Link>
                </div>

                <div className="admin-card">
<<<<<<< HEAD
                    <div className="card-icon edit-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h2>Editar Eventos</h2>
                    <p>Actualiza y modifica la información de los eventos existentes.</p>
                    <Link to='/events' className="admin-btn">
                        Gestionar Eventos
=======
                    <div className="card-icon users-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2>Registrar Administrador</h2>
                    <p>Registra nuevos administradores para gestionar el sistema.</p>
                    <Link to='/admin-register' className="admin-btn">
                        Registrar Administrador
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
