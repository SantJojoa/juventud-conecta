// src/components/shared/EditEventForm.jsx
import React, { useEffect } from 'react';
import { useEventForm } from '../../hooks/useEventForm';
import { EventService } from '../../services/eventService';
import { AuthService } from '../../services/authService';
import Swal from 'sweetalert2';
import './EditEventForm.css';

const EditEventForm = ({ event, onClose, onEventUpdated }) => {
    const { formData, invalidFields, handleChange, validateForm, setFormData } = useEventForm(event);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire({
                title: 'Formulario incompleto',
                text: 'Por favor completa todos los campos requeridos',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        try {
            const token = AuthService.getToken();
            await EventService.update(event._id, formData, token);

            Swal.fire({
                title: '¡Actualizado!',
                text: 'El evento ha sido actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });

            if (typeof onEventUpdated === 'function') {
                onEventUpdated(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error updating event:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Error al actualizar el evento',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <div className="edit-event-overlay" onClick={onClose}>
            <div className="edit-event-form" onClick={(e) => e.stopPropagation()}>
                <div className="form-header">
                    <h2>Editar Evento</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <p className="form-label">Título</p>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={invalidFields.title ? 'invalid' : ''}
                        />
                        {invalidFields.title && <span className="error-message">El título es obligatorio</span>}
                    </div>

                    <div className="form-group">
                        <p className="form-label">URL de la imagen</p>
                        <input
                            type="text"
                            id="imageSrc"
                            name="imageSrc"
                            value={formData.imageSrc}
                            onChange={handleChange}
                            className={invalidFields.imageSrc ? 'invalid' : ''}
                        />
                        {invalidFields.imageSrc && <span className="error-message">La URL de la imagen es obligatoria</span>}
                    </div>

                    <div className="form-group">
                        <p className="form-label">Fecha</p>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date ? formData.date.substring(0, 10) : ''}
                            onChange={handleChange}
                            className={invalidFields.date ? 'invalid' : ''}
                        />
                        {invalidFields.date && <span className="error-message">La fecha es obligatoria</span>}
                    </div>

                    <div className="form-group">
                        <p className="form-label">Horario</p>
                        <input
                            type="text"
                            id="schedule"
                            name="schedule"
                            value={formData.schedule}
                            onChange={handleChange}
                            className={invalidFields.schedule ? 'invalid' : ''}
                        />
                        {invalidFields.schedule && <span className="error-message">El horario es obligatorio</span>}
                    </div>

                    <div className="form-group">
                        <p className="form-label">Ubicación</p>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={invalidFields.location ? 'invalid' : ''}
                        />
                        {invalidFields.location && <span className="error-message">La ubicación es obligatoria</span>}
                    </div>

                    <div className="form-group">
                        <p className="form-label">Descripción</p>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={invalidFields.description ? 'invalid' : ''}
                            rows="4"
                        ></textarea>
                        {invalidFields.description && <span className="error-message">La descripción es obligatoria</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="save-button">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventForm;