import React from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';


const AdminDashboard = () => {
    const firstName = localStorage.getItem("firstName") || '';
    const lastName = localStorage.getItem("lastName") || '';
    const adminName = `${firstName} ${lastName}` || 'Administrador';
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
                    <h2>Gestionar Eventos</h2>
                    <p>Administra, edita y gestiona formularios e inscripciones.</p>
                    <Link to='/manage-events' className="admin-btn" >
                        Ir a Gestionar Eventos
                    </Link>
                </div>

                <div className="admin-card">
                    <div className="card-icon users-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2>Gestionar Usuarios</h2>
                    <p>Administra, edita y gestiona usuarios del sistema.</p>
                    <Link to='/manage-users' className="admin-btn">
                        Ir a Gestionar Usuarios
                    </Link>
                </div>

                <div className="admin-card">
                    <div className="card-icon users-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2>Registrar Administrador</h2>
                    <p>Registra nuevos administradores para gestionar el sistema.</p>
                    <Link to='/admin-register' className="admin-btn">
                        Registrar Administrador
                    </Link>
                </div>

                <div className="admin-card">
                    <div className="card-icon view-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V7a4 4 0 118 0v4m-1 10H6a2 2 0 01-2-2V11a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2>Estadísticas</h2>
                    <p>Consulta métricas: vistas, favoritos, ratings y más.</p>
                    <Link to='/admin-stats' className="admin-btn">
                        Ver Estadísticas
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
