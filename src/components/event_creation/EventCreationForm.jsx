import { useState } from 'react';
import './EventCreationForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

function EventCreationForm() {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        startDate: new Date(),
        startTime: '',
        endTime: '',
        location: '',
        importance: '',

    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const [startDate, setStartDate] = useState(null);

    const handleDateChange = (date) => {
        setStartDate(date);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envio de datos a backend
        console.log('Event Data:', eventData);
        console.log('Image:', selectedImage);
    };

    const importanceOptions = [
        { value: '', label: 'Seleccionar importancia', disabled: true },
        { value: 'alta', label: 'Alta' },
        { value: 'media', label: 'Media' },
        { value: 'baja', label: 'Baja' }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Crear evento</h2>
                    <button className="close-button" aria-label="Cerrar">✕</button>
                </div>
                <div className="modal-body">
                    <div className="organizer-info">
                        <div className="organizer-avatar">
                            <img src="AquiCualquierImagen" alt="Avatar" />
                        </div>
                        <div className="organizer-details">
                            <h3>• Bienvenido •</h3>
                            <p>ADMINISTRADOR</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre del evento"
                                value={eventData.name}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                placeholder="Descripción del evento"
                                value={eventData.description}
                                onChange={handleInputChange}
                                className="form-control"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="image-upload-area">
                            <div htmlFor="image-upload" className="upload-button">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </div>
                            {imagePreviewUrl && (
                                <div className="selected-image">
                                    <img src={imagePreviewUrl} alt="Vista previa" />
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-column">
                                <div className="input-group">
                                    <span className="input-icon">📅</span>
                                    <div>
                                        <input
                                            type="date"
                                            id="start-date"
                                            value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleDateChange(new Date(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-column">
                                <div className="input-group">
                                    <span className="input-icon">🕒</span>
                                    <div className="input-wrapper">
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={eventData.startTime}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-icon">📍</span>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        name="location"
                                        value={eventData.location}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Añadir ubicación"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-icon">⚑</span>
                                <div className="input-wrapper">
                                    <select
                                        name="importance"
                                        value={eventData.importance}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        {importanceOptions.map((option) => (
                                            <option
                                                key={option.value || 'default'}
                                                value={option.value}
                                                disabled={option.disabled}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="submit-button">
                                Crear evento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EventCreationForm;