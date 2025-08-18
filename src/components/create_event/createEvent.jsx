import { useState } from "react";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import './CreateEvent.css';

// import { useEventPopup } from "../../hooks/useEventPopup";
import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import ErrorMessage from "../shared/ErrorMessage";
import { useEventForm } from "../../hooks/useEventForm";



const CreateEvent = () => {

    const {
        formData,
        invalidFields,
        handleChange,
        validateForm,
        resetForm,
    } = useEventForm();

    const [error, setError] = useState('');

    const showSuccessModal = () => {
        Swal.fire({
            icon: 'success',
            title: 'Evento Creado',
            text: 'El evento se ha creado exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#198754',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-confirm-button'
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const token = AuthService.getToken();
        setError('');

        try {
            if (!token) {
                setError('No autenticado');
                return;
            }

            const eventData = {
                ...formData,
                schedule: formData.schedule.split(',').map(item => item.trim())
            };

            const data = await EventService.create(eventData, token);

            if (!data || data.error) {
                throw new Error(data.error || 'Error al crear el evento');
            }

            showSuccessModal();
            resetForm();

        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="create-event-container">
            <h2>Crear Evento</h2>
            <form onSubmit={handleSubmit} noValidate>

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título del evento"
                    required
                    className={invalidFields.title ? 'invalid-field' : ''}
                />

                <input
                    name="imageSrc"
                    value={formData.imageSrc}
                    onChange={handleChange}
                    placeholder="URL de la imagen"
                    required
                    className={invalidFields.imageSrc ? 'invalid-field' : ''}
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                    className={invalidFields.description ? 'invalid-field' : ''}
                />

                <input
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="Horario (separado por comas)"
                    required
                    className={invalidFields.schedule ? 'invalid-field' : ''}
                />

                <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={invalidFields.date ? 'invalid-field' : ''}
                />

                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ubicación"
                    required
                    className={invalidFields.location ? 'invalid-field' : ''}
                />

                <button type="submit">Crear Evento</button>

            </form>

            {error && <ErrorMessage message={error} />}
            <ToastContainer />
        </div>
    );

};


export default CreateEvent;
