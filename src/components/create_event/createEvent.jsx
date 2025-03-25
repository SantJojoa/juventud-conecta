import { useState } from "react";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
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
    const [invalidFields, setInvalidFields] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (invalidFields[name]) {
            setInvalidFields({ ...invalidFields, [name]: false });
        }
    };

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

    const validateForm = () => {

        const newInvalidFields = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            if (!formData[field]) {
                newInvalidFields[field] = true;
                isValid = false;
            } else {
                newInvalidFields[field] = false;
            }
        });

        setInvalidFields(newInvalidFields);

        if (!isValid) {
            toast.error('Por favor, completa todos los campos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                closeButton: false

            });
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const token = localStorage.getItem("token"); // Aquí recuperas el token
        setError('');

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

            showSuccessModal();


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
            <form onSubmit={handleSubmit} noValidate>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Título del evento" required className={invalidFields.title ? 'invalid-field' : ''} />
                <input name="imageSrc" value={formData.imageSrc} onChange={handleChange} placeholder="URL de la imagen" required className={invalidFields.imageSrc ? 'invalid-field' : ''} />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required className={invalidFields.description ? 'invalid-field' : ''} />
                <input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="Horario (separado por comas)" required className={invalidFields.schedule ? 'invalid-field' : ''} />
                <input name="date" type="date" value={formData.date} onChange={handleChange} required className={invalidFields.date ? 'invalid-field' : ''} />
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Ubicación" required className={invalidFields.location ? 'invalid-field' : ''} />
                <button type="submit">Crear Evento</button>
            </form>

            {error && <p className="error">{error}</p>}

            <ToastContainer
            />
        </div>
    );
};

export default CreateEvent;
