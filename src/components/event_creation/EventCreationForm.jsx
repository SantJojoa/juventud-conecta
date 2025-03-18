import { useState } from 'react';
import './EventCreationForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};


function EventCreationForm() {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        startDate: new Date(),
        startTime: '14:00',
        endTime: '',
        location: '',
        importance: '',
        lat: center.lat,
        lng: center.lng
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

    const handleMapClick = (e) => {
        setEventData((prevData) => ({
            ...prevData,
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Using FileReader to create a URL for preview
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

    // Define dropdown options as an array to avoid string evaluations
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
                            <img src="data:image/jpeg;base64,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" alt="Avatar" />
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
                            <label htmlFor="image-upload" className="upload-button">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </label>
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