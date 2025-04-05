import { useState } from "react";
<<<<<<< HEAD
import './CreateEvent.css';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        imageSrc: '',
        description: '',
        schedule: '',
        date: '',
        location: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Aquí recuperas el token
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem("token");
            if (!token) return setError('No tienes autorización');

            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    schedule: formData.schedule.split(',').map(item => item.trim()) // Convierte a array
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Error al crear el evento');

            setSuccess('✅ Evento creado exitosamente');
            setFormData({
                title: '',
                imageSrc: '',
                description: '',
                schedule: '',
                date: '',
                location: '',
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="create-event-container">
            <h2>Crear Evento</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Título del evento" required />
                <input name="imageSrc" value={formData.imageSrc} onChange={handleChange} placeholder="URL de la imagen" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required />
                <input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="Horario (separado por comas)" required />
                <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Ubicación" required />
                <button type="submit">Crear Evento</button>
            </form>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

=======
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import './CreateEvent.css';

import { useEventPopup } from "../../hooks/useEventPopup";
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


>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
export default CreateEvent;
