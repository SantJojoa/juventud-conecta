import React, { useState, useEffect, useRef } from 'react';
import './EventMap.css';
import { LocationService } from '../../services/locationService';

const EventMap = ({
    location,
    locationName,
    latitude,
    longitude,
    height = '300px',
    showControls = true,
    zoom = 15
}) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Función para geocodificar una dirección si no tenemos coordenadas
    const geocodeAddress = async (address) => {
        const result = await LocationService.geocodeAddress(address);
        if (result) {
            return {
                lat: result.latitude,
                lng: result.longitude
            };
        }
        return null;
    };

    useEffect(() => {
        // Limpiar mapa anterior si existe
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const initMap = async () => {
            if (!mapRef.current) return;

            try {
                let coords = null;

                // Si tenemos coordenadas, las usamos directamente
                if (latitude && longitude) {
                    coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
                } else if (location) {
                    // Si no tenemos coordenadas pero sí dirección, geocodificamos
                    coords = await geocodeAddress(location);
                }

                if (!coords) {
                    setMapError('No se pudo obtener la ubicación del evento');
                    return;
                }

                // Crear el mapa usando Leaflet
                const L = window.L;
                if (!L) {
                    setMapError('Biblioteca de mapas no cargada');
                    return;
                }

                const map = L.map(mapRef.current).setView([coords.lat, coords.lng], zoom);
                mapInstanceRef.current = map;

                // Agregar capa de tiles (OpenStreetMap es gratuito)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Agregar marcador
                const marker = L.marker([coords.lat, coords.lng]).addTo(map);

                // Agregar popup con información del evento
                const popupContent = `
                    <div class="event-popup">
                        <h4>${locationName || 'Evento'}</h4>
                        <p>${location || 'Ubicación del evento'}</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}" 
                           target="_blank" rel="noopener noreferrer">
                            🧭 Cómo llegar
                        </a>
                    </div>
                `;
                marker.bindPopup(popupContent);

                setMapLoaded(true);
            } catch (error) {
                console.error('Error inicializando mapa:', error);
                setMapError('Error al cargar el mapa');
            }
        };

        initMap();

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location, locationName, latitude, longitude, zoom]);

    // Cargar Leaflet dinámicamente
    useEffect(() => {
        const loadLeaflet = () => {
            if (window.L) return;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => setMapLoaded(true);
            document.head.appendChild(script);
        };

        loadLeaflet();
    }, []);

    if (mapError) {
        return (
            <div className="event-map-error">
                <p>📍 {mapError}</p>
                {location && (
                    <p className="fallback-location">
                        <strong>Dirección:</strong> {location}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="event-map-container">
            <div
                ref={mapRef}
                className="event-map"
                style={{ height }}
            />
            {showControls && location && (
                <div className="map-controls">
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-control-button"
                    >
                        📍 Abrir en Google Maps
                    </a>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-control-button"
                    >
                        🧭 Cómo llegar
                    </a>
                </div>
            )}
        </div>
    );
};

export default EventMap;
