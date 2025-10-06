import React, { useState, useEffect, useRef } from 'react';
import { LocationService } from '../../services/locationService';
import './LocationPicker.css';

const LocationPicker = ({
    onLocationChange,
    initialLocation = '',
    initialLatitude = null,
    initialLongitude = null,
    showMap = true,
    height = '300px'
}) => {
    const [address, setAddress] = useState(initialLocation);
    const [latitude, setLatitude] = useState(initialLatitude);
    const [longitude, setLongitude] = useState(initialLongitude);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Función para notificar cambios al componente padre
    const notifyChange = () => {
        onLocationChange({
            location: address,
            latitude: latitude,
            longitude: longitude
        });
    };

    // Geocodificar dirección
    const handleGeocode = async () => {
        if (!address.trim()) return;

        setIsGeocoding(true);
        try {
            const result = await LocationService.geocodeAddress(address);
            if (result) {
                setLatitude(result.latitude);
                setLongitude(result.longitude);
                updateMapMarker(result.latitude, result.longitude);
                notifyChange();
            } else {
                setMapError('No se pudo encontrar la ubicación');
            }
        } catch (error) {
            setMapError('Error al geocodificar la dirección');
            console.error('Error en geocodificación:', error);
        } finally {
            setIsGeocoding(false);
        }
    };

    // Actualizar marcador en el mapa
    const updateMapMarker = (lat, lng) => {
        if (!mapInstanceRef.current || !window.L) return;

        const L = window.L;

        // Remover marcador anterior
        if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Crear nuevo marcador
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        mapInstanceRef.current.setView([lat, lng], 15);
    };

    // Inicializar mapa
    useEffect(() => {
        if (!showMap || !mapRef.current) return;

        // Limpiar mapa anterior si existe
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const initMap = () => {
            const L = window.L;
            if (!L) return;

            // Coordenadas por defecto (Pasto, Colombia)
            const defaultLat = latitude || 1.2136;
            const defaultLng = longitude || -77.2811;

            const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
            mapInstanceRef.current = map;

            // Agregar capa de tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Agregar marcador si tenemos coordenadas
            if (latitude && longitude) {
                markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
            }

            // Manejar clics en el mapa
            map.on('click', async (e) => {
                const { lat, lng } = e.latlng;
                setLatitude(lat);
                setLongitude(lng);

                // Actualizar marcador
                if (markerRef.current) {
                    mapInstanceRef.current.removeLayer(markerRef.current);
                }
                markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);

                // Geocodificación inversa para obtener la dirección
                try {
                    const result = await LocationService.reverseGeocode(lat, lng);
                    if (result) {
                        setAddress(result.formatted_address);
                        notifyChange();
                    }
                } catch (error) {
                    console.error('Error en geocodificación inversa:', error);
                }
            });

            setMapLoaded(true);
        };

        // Cargar Leaflet si no está cargado
        if (!window.L) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [showMap, latitude, longitude]);

    return (
        <div className="location-picker">
            <div className="location-input-section">
                <div className="input-group">
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            // Notificar cambio inmediatamente al escribir
                            setTimeout(notifyChange, 100);
                        }}
                        placeholder="Ingresa la dirección del evento"
                        className="location-input"
                    />
                    <button
                        type="button"
                        onClick={handleGeocode}
                        disabled={isGeocoding || !address.trim()}
                        className="geocode-button"
                    >
                        {isGeocoding ? '🔍 Buscando...' : '🔍 Buscar'}
                    </button>
                </div>

                {(latitude && longitude) && (
                    <div className="coordinates-info">
                        <small>
                            📍 Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </small>
                    </div>
                )}
            </div>

            {showMap && (
                <div className="location-map-section">
                    <div
                        ref={mapRef}
                        className="location-map"
                        style={{ height }}
                    />
                    {mapError && (
                        <div className="map-error">
                            <p>⚠️ {mapError}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
