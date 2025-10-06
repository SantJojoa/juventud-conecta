// Servicio simplificado de geocodificación que funciona sin API keys
// Usa Nominatim (OpenStreetMap) que es completamente gratuito

export const LocationService = {
    // Geocodificar una dirección a coordenadas
    async geocodeAddress(address) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=co&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'JuventudConecta/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error en geocodificación: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                return {
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon),
                    formatted_address: result.display_name,
                    components: result.address
                };
            }

            return null;
        } catch (error) {
            console.error('Error en geocodificación:', error);
            return null;
        }
    },

    // Geocodificación inversa: coordenadas a dirección
    async reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
                {
                    headers: {
                        'User-Agent': 'JuventudConecta/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error en geocodificación inversa: ${response.status}`);
            }

            const data = await response.json();

            return {
                formatted_address: data.display_name,
                components: data.address
            };
        } catch (error) {
            console.error('Error en geocodificación inversa:', error);
            return null;
        }
    },

    // Validar si una dirección está en Colombia
    isInColombia: (components) => {
        return components && components.country_code === 'co';
    },

    // Obtener información detallada de la ubicación
    getLocationInfo: (components) => {
        return {
            city: components.city || components.town || components.village,
            state: components.state,
            country: components.country,
            postcode: components.postcode,
            road: components.road,
            house_number: components.house_number
        };
    }
};
