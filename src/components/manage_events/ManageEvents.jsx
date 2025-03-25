import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './ManageEvents.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cargar eventos cuando el componente se monta
    useEffect(() => {
        fetchEvents();
    }, []);

    // Función para obtener todos los eventos
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError('No tienes autorización');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/events', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al cargar eventos');
            }

            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Función para manejar la eliminación de un evento
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
                    const token = localStorage.getItem("token");
                    if (!token) {
                        Swal.fire('Error', 'No tienes autorización', 'error');
                        return;
                    }

                    const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al eliminar el evento');
                    }

                    // Actualizar la lista de eventos después de eliminar
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
                <p className="loading">Cargando eventos...</p>
            ) : error ? (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            ) : (
                <>
                    <div className="manage-events-grid">
                        {events.length === 0 ? (
                            <p className="no-events">No hay eventos disponibles</p>
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
                                    </div>
                                    <div className="manage-event-actions">
                                        <Link to={`/edit-event/${event._id}`} className="manage-edit-button">
                                            Editar
                                        </Link>
                                        <button
                                            className="manage-delete-button"
                                            onClick={() => handleDeleteEvent(event._id)}
                                        >
                                            Eliminar
                                        </button>
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