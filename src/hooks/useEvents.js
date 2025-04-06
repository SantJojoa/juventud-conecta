// hooks/useEvents.js
import { useState, useEffect } from 'react';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error, setEvents };
};