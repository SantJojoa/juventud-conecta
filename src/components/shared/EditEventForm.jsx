import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

import { EventService } from "../../services/eventService";
import { AuthService } from "../../services/authService";
import '../login/Login.css';


import ErrorMessage from "../shared/ErrorMessage";


const EditEventForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        imageSrc: "",
    });


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = AuthService.getToken();
                if (!token) throw new Error("No autenticado");

                const event = await EventService.getById(id, token);
                if (!event) throw new Error("Evento no encontrado");

                setFormData(event);

            } catch (err) {
                setError(err.message);

            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const showSuccessModal = () => {
        Swal.fire({
            icon: "success",
            title: "Evento Actualizado",
            text: "Los cambios se han guardado exitosamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#198754",
        }).then(() => {
            navigate("/events"); // redirige a la lista de eventos
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const token = AuthService.getToken();
        setError('');

        try {
            if (!token) {
                setError('No autenticado');
                return;
            }

            const data = await EventService.update(id, formData, token);

            if (!data || data.error) {
                throw new Error(data.error || 'Error al actualizar el evento');
            }

            showSuccessModal();

        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="create-event-container">
            <h2>Editar Evento</h2>
            <form className="create-event-form" onSubmit={handleSubmit} noValidate>
                <div className="create-event-form-group">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Titulo del evento"
                        required
                    />
                </div>

                <div className="create-event-form-group">
                    <button
                        type="button"
                        className="upload-button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Cambiar imagen
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            try {
                                const formDataUpload = new FormData();
                                formDataUpload.append('file', file);
                                formDataUpload.append('upload_preset', 'events-unsigned');

                                const res = await fetch(
                                    "https://api.cloudinary.com/v1_1/dqgpyi8ox/image/upload",
                                    {
                                        method: "POST",
                                        body: formDataUpload
                                    }
                                );

                                if (!res.ok) throw new Error('Error al actualizar la imagen');
                                const data = await res.json();

                                setFormData({
                                    ...formData,
                                    imageSrc: data.secure_url
                                })

                                toast.success('Imagen actualizada exitosamente', {
                                    closeButton: false,
                                });
                            } catch (error) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Error al subir la imagen",
                                    text: "No se pudo subir la imagen a Cloudinary",
                                    confirmButtonColor: "#d63031",
                                });
                            }
                        }}
                    />

                    {formData.imageSrc && (
                        <img
                            src={formData.imageSrc}
                            alt="Vista previa"
                            style={{ maxWidth: "150px", marginTop: "10px" }}
                        />
                    )}
                </div>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                />

                <div className="create-event-form-group">
                    <label>Fecha de inicio</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>


                <div className="create-event-form-group">
                    <label>Hora de inicio</label>
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="create-event-form-group">
                    <label>Fecha de fin</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="create-event-form-group">
                    <label>Hora de fin</label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="create-event-form-group">
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ubicación"
                        required
                    />
                </div>

                <button className="submit-button" type="submit">
                    Guardar Cambios
                </button>






            </form>

            {error && <ErrorMessage message={error} />}
            <ToastContainer />

        </div>
    )
}

export default EditEventForm