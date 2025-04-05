// hooks/useEventPopup.js
import { useState, useCallback } from 'react';

export const useEventPopups = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const openEventPopup = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    const closeEventPopup = useCallback(() => {
        setSelectedEvent(null);
    }, []);

    return { selectedEvent, openEventPopup, closeEventPopup };
};