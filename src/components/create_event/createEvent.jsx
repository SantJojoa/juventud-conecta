import { useState } from "react";
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

export default CreateEvent;
