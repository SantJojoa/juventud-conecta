import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService } from '../services/eventService';
import { checkIsFavorite, addToFavorites, removeFromFavorites } from '../services/userService';
import { AuthService } from '../services/authService';
import Swal from 'sweetalert2';
import './EventDetail.css';
import StarRating from "../components/shared/StarRating";



const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [errorComments, setErrorComments] = useState(null);

    const [replyInputs, setReplyInputs] = useState({});
    const [replyLoading, setReplyLoading] = useState({});


    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);

        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    useEffect(() => {
        fetchComments();
    }, [id]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/comments/event/${id}`);
            setComments(res.data);
        } catch (error) {
            setErrorComments(error.message);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setErrorComments('');
        if (!newComment.trim()) return;

        try {
            await axios.post(
                `http://localhost:5000/api/comments/event/${id}`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            setErrorComments(error.message);
        }
    };

    const handleReplyChange = async (commentId, value) => {
        setReplyInputs(prev => ({ ...prev, [commentId]: value }));
    };

    const handleReplySubmit = async (commentId) => {
        setReplyLoading(prev => ({ ...prev, [commentId]: true }));
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/comments/${commentId}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ adminResponse: replyInputs[commentId] })
            });
            if (!res.ok) throw new Error('Error al responder el comentario');
            const updatedComment = await res.json();

            setComments(prev =>
                prev.map(c => (c.id === updatedComment.id ? updatedComment : c))
            );
            setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
        } catch (err) {
            alert('Error al responder ', err) // CAMBIAR POR UN MODAL
            console.log(err)
        }
        setReplyLoading(prev => ({ ...prev, [commentId]: false }));
    };



    useEffect(() => {
        // Check if user is admin
        setIsAdmin(localStorage.getItem('userRole') === 'admin');

        const fetchEvent = async () => {
            try {
                const eventData = await EventService.getById(id);
                setEvent(eventData);

                // Check favorite status if user is logged in
                if (AuthService.isAuthenticated()) {
                    try {
                        const favoriteStatus = await checkIsFavorite(id);
                        setIsFavorite(favoriteStatus);
                    } catch (error) {
                        console.error('Error checking favorite status:', error);
                    }
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('No se pudo cargar el evento. Puede que no exista o haya sido eliminado.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!AuthService.isAuthenticated()) {
            Swal.fire({
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para guardar eventos como favoritos',
                icon: 'info',
                confirmButtonText: 'Ir a login',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await removeFromFavorites(id);
                setIsFavorite(false);
                Swal.fire({
                    title: 'Éxito',
                    text: 'Evento eliminado de favoritos',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await addToFavorites(id);
                setIsFavorite(true);
                Swal.fire({
                    title: 'Éxito',
                    text: 'Evento guardado en favoritos',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al actualizar favoritos',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede revertir. ¿Realmente deseas eliminar este evento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true);
                    const token = AuthService.getToken();
                    await EventService.delete(id, token);

                    Swal.fire(
                        '¡Eliminado!',
                        'El evento ha sido eliminado correctamente.',
                        'success'
                    );

                    navigate('/');
                } catch (error) {
                    console.error('Error deleting event:', error);
                    Swal.fire(
                        'Error',
                        error.message || 'Error al eliminar el evento',
                        'error'
                    );
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="event-detail-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando evento...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="event-detail-container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button className="back-button" onClick={() => navigate('/')}>
                        Volver a la página principal
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-detail-container">
                <div className="error-message">
                    <h2>Evento no encontrado</h2>
                    <p>El evento que estás buscando no existe o ha sido eliminado.</p>
                    <button className="back-button" onClick={() => navigate('/')}>
                        Volver a la página principal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="event-detail-container">
            <div className="event-detail-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>

            <div className="event-detail-content">
                <div className="event-detail-image-container">
                    <img
                        src={event.imageSrc}
                        alt={event.title}
                        className="event-detail-image"
                    />
                    <div className="event-detail-rating">
                        <h3>Califica este evento</h3>
                        <StarRating
                            eventId={event.id}
                            initialRating={event.userRating || 0}       // si tu backend envía la calificación del usuario
                            initialAverage={event.averageRating || 0}   // promedio actual del evento
                            onRated={(newAverage) => setEvent(prev => ({ ...prev, averageRating: newAverage }))}
                        />
                    </div>


                </div>






                <div className="event-detail-info">
                    <h1 className="event-detail-title">{event.title}</h1>
                    <div className="event-detail-metadata">
                        <div className="metadata-item">
                            <span className="metadata-label">Desde:</span>
                            <span className="metadata-value">
                                {event.startDate ? capitalizeFirstLetter(new Date(event.startDate).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })) : 'Fecha no disponible'}
                            </span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">Hasta:</span>
                            <span className="metadata-value">
                                {event.endDate ? capitalizeFirstLetter(new Date(event.endDate).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })) : 'Fecha no disponible'}
                            </span>
                        </div>

                        <div className="metadata-item">
                            <span className="metadata-label">Horario:</span>
                            <span className="metadata-value">
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}

                            </span>
                        </div>



                        {event.schedule && (
                            <div className="metadata-item">
                                <span className="metadata-label">Horario:</span>
                                <span className="metadata-value">
                                    {Array.isArray(event.schedule) ? event.schedule.join(', ') : event.schedule}
                                </span>
                            </div>
                        )}

                        {/* <div className="metadata-item">
                            <span className="metadata-label">
                                Ubicación:
                            </span>
                            <div className="metadata-value">
                                <p>{event.location || 'Ubicación no disponible'}</p>

                                {event.location && (
                                    <iframe
                                        width="100%"
                                        height="350"
                                        style={{ border: 0, borderRadius: "10px", marginTop: "10px" }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBmbDPza7_LCrSrbaIlLzj5etzlERG7epU&q=${encodeURIComponent(event.location)}`}
                                    ></iframe>
                                )}
                            </div>
                        </div> */}




                        <div className="metadata-item">
                            <span className="metadata-label">Ubicación:</span>
                            <span className="metadata-value">
                                {event.location || 'Ubicación no disponible'}
                            </span>
                        </div>
                    </div>

                    <div className="event-detail-description">
                        <h3>Descripción del evento</h3>
                        <p>{event.description || 'Sin descripción disponible'}</p>
                    </div>

                    <div className="event-detail-actions">
                        <button
                            className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
                            onClick={handleToggleFavorite}
                            disabled={isLoading}
                        >
                            {isLoading ? "Cargando..." : (
                                isFavorite ? "❤️ Quitar de favoritos" : "🤍 Guardar como favorito"
                            )}
                        </button>

                        <button className="inscribe-button" onClick={() => navigate(`/events/${id}/registration`)}>
                            Inscribirse al evento
                        </button>

                        {isAdmin && (
                            <div className="admin-controls">
                                <button
                                    className="edit-button"
                                    onClick={() => navigate(`/edit-event/${id}`)}
                                >
                                    Editar evento
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={handleDeleteEvent}
                                    disabled={isLoading}
                                >
                                    Eliminar evento
                                </button>
                            </div>
                        )}
                    </div>
                </div>


            </div>


            <div className="event-detail-info comments-section">
                <h3>Comentarios</h3>
                {loadingComments ? (
                    <p>Cargando comentarios...</p>
                ) : comments.length === 0 ? (
                    <p>No hay comentarios aun</p>
                ) : (
                    <ul className='comments-list'>
                        {comments.map((c) => (
                            <li key={c.id} className='comment-item'>
                                <div className="comment-user">
                                    <img className="comment-avatar" src={c.user?.avatarUrl} alt="" />
                                    <span><b>{c.user?.firstName} {c.user?.lastName}</b></span>
                                    <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>{new Date(c.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="comment-content">
                                    {c.content}
                                </div>
                                {c.adminResponse && (
                                    <div className="admin-response">
                                        <b>Respuesta de administrador:</b> {c.adminResponse}
                                        <span >{new Date(c.respondedAt).toLocaleString()}</span>
                                    </div>
                                )}

                                {isAdmin && !c.adminResponse && (
                                    <div className='admin-reply-form' style={{ marginTop: 8 }}>
                                        <textarea
                                            placeholder='Responder como administrador'
                                            value={replyInputs[c.id] || ''}
                                            onChange={e => handleReplyChange(c.id, e.target.value)}
                                            rows={2}
                                            style={{ width: '100%', marginBottom: 4 }}
                                        />
                                        <button
                                            onClick={() => handleReplySubmit(c.id)}
                                            disabled={replyLoading[c.id] || !(replyInputs[c.id] && replyInputs[c.id].trim())}
                                            style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4 }}

                                        >
                                            {replyLoading[c.id] ? 'Enviando...' : 'Responder'}

                                        </button>


                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                )}
                <div className='divider'></div>
                <strong>
                    ¿Te gustaría este evento? ¿Qué te parecería si mejoramos algo? Comparte tus ideas y
                    ayuda a que los eventos sean cada vez mejores para ti y para la comunidad.
                </strong>
                {localStorage.getItem('token') ? (
                    <form onSubmit={handleCommentSubmit} className='comment-form'>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Escribe un comentario...'
                            rows={3}
                            required
                        />
                        <button type="submit" className='comment-button'>Enviar comentario </button>
                        {errorComments && <div className="comment-error">{errorComments}</div>}

                    </form>
                ) : (
                    <p>Por favor, inicia sesión para comentar</p>
                )}
            </div>
        </div>
    );
};

export default EventDetail;