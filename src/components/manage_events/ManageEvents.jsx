import React from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import './ManageEvents.css';

import { useEvents } from "../../hooks/useEvents";
import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import LoadingIndicator from "../shared/LoadingIndicator";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyStateMessage from "../shared/EmptyStateMessage";

const ManageEvents = () => {
    const { events, loading, error, fetchEvents, setEvents } = useEvents();

    const handleDeleteEvent = async (eventId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = AuthService.getToken();
                    if (!token) {
                        Swal.fire('Error', 'No tienes autorización', 'error');
                        return;
                    }

                    const data = await EventService.delete(eventId, token);

                    if (data && data.error) {
                        throw new Error(data.error || 'Error al eliminar el evento');
                    }

                    setEvents(events.filter(event => event._id !== eventId));

                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado correctamente',
                        'success'
                    );
                } catch (err) {
                    Swal.fire(
                        'Error',
                        err.message,
                        'error'
                    );
                }
            }
        });
    };

    return (
        <div className="manage-events-container">
            <div className="manage-events-header">
                <h1>Gestionar Eventos</h1>
                <Link to="/create-event" className="add-event-button">
                    + Crear Nuevo Evento
                </Link>
            </div>

            {loading ? (
                <LoadingIndicator message="Cargando eventos..." />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <>
                    <div className="manage-events-grid">
                        {events.length === 0 ? (
                            <EmptyStateMessage message="No hay eventos disponibles" />
                        ) : (
                            events.map(event => (
                                <div className="manage-event-card" key={event._id}>
                                    <div className="manage-event-image">
                                        <img src={event.imageSrc} alt={event.title} />
                                    </div>
                                    <div className="manage-event-details">
                                        <h2>{event.title}</h2>
                                        <p className="manage-event-date">{new Date(event.date).toLocaleDateString()}</p>
                                        <p className="manage-event-location">{event.location}</p>
                                        <div className="manage-event-actions">
                                            <Link to={`/edit-event/${event._id}`} className="manage-button manage-edit-button">
                                                Editar
                                            </Link>
                                            <Link to={`/events/${event._id}/form-builder`} className="manage-button manage-form-button">
                                                Formulario
                                            </Link>
                                            <Link to={`/events/${event._id}/submissions`} className="manage-button manage-submissions-button">
                                                Inscripciones
                                            </Link>
                                            <button
                                                className="manage-button manage-delete-button"
                                                onClick={() => handleDeleteEvent(event._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageEvents;

