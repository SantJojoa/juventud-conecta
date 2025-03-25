import { useState, useEffect, useCallback } from 'react';
import { EventService } from '../services/eventService';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await EventService.getAll();
            setEvents(Array.isArray(data) ? data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError("No se pudieron cargar los eventos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, error, fetchEvents, setEvents };
};
