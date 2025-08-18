//CÓDIGO DE RESPALDO -- ELIMINAR DESPUÉS DE QUE SE IMPLEMENTE EL NUEVO CÓDIGO

// // hooks/useEventPopup.js
// import { useState, useCallback } from 'react';

// export const useEventPopup = () => {
//     const [selectedEvent, setSelectedEvent] = useState(null);

//     const openEventPopup = useCallback((event) => {
//         setSelectedEvent(event);
//     }, []);

//     const closeEventPopup = useCallback(() => {
//         setSelectedEvent(null);
//     }, []);

//     return { selectedEvent, openEventPopup, closeEventPopup };
// };