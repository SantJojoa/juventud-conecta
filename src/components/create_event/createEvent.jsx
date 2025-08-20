import { useRef, useState } from "react";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import './CreateEvent.css';

import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";

import ErrorMessage from "../shared/ErrorMessage";
import { useEventForm } from "../../hooks/useEventForm";




const CreateEvent = () => {

    const fileInputRef = useRef(null);

    const [fileName, setFileName] = useState('');

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

            const data = await EventService.create(formData, token);

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

                <div className="create-event-form-group">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Título del evento"
                        required
                        className={invalidFields.title ? 'invalid-field' : ''}
                    />
                </div>

                <div className="create-event-form-group">
                    {/* Botón personalizado */}
                    <button
                        type="button"
                        className="upload-button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Subir imagen
                    </button>

                    {/* Input real oculto */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            try {
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('upload_preset', 'events-unsigned');

                                const res = await fetch(
                                    'https://api.cloudinary.com/v1_1/dqgpyi8ox/image/upload',
                                    { method: 'POST', body: formData }
                                );

                                if (!res.ok) throw new Error('Error al subir la imagen');
                                const data = await res.json();

                                handleChange({
                                    target: {
                                        name: 'imageSrc',
                                        value: data.secure_url
                                    }
                                });

                                toast.success("Imagen subida exitosamente", { closeButton: false });

                            } catch (error) {
                                console.error(error);
                                Swal.fire({
                                    icon: "error",
                                    title: "Error al subir la imagen",
                                    text: "No se pudo subir la imagen a Cloudinary",
                                    confirmButtonColor: "#d63031"
                                });
                            }

                        }}
                        required
                    />
                </div>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                    className={invalidFields.description ? 'invalid-field' : ''}
                />

                <div className="create-event-form-group">

                    <label htmlFor="startDate">Fecha de inicio</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className={invalidFields.startDate ? 'invalid-field' : ''}
                    />

                </div>


                <div className="create-event-form-group">

                    <label htmlFor="startTime">Hora de inicio</label>
                    <input
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className={invalidFields.startTime ? 'invalid-field' : ''}
                    />

                </div>


                <div className="create-event-form-group">
                    <label htmlFor="endDate">Fecha de fin</label>
                    <input
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className={invalidFields.endDate ? 'invalid-field' : ''}
                    />

                </div>



                <div className="create-event-form-group">


                    <label htmlFor="endTime">Hora de fin</label>
                    <input
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className={invalidFields.endTime ? 'invalid-field' : ''}
                    />
                </div>

                <div className="create-event-form-group">
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ubicación"
                        required
                        className={invalidFields.location ? 'invalid-field' : ''}
                    />

                </div>


                <button className="submit-button" type="submit">Crear Evento</button>

            </form>

            {error && <ErrorMessage message={error} />}
            <ToastContainer />
        </div>
    );

};


export default CreateEvent;
