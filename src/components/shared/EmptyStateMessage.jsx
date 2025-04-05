// components/shared/EmptyStateMessage.jsx
import React from 'react';

const EmptyStateMessage = ({ message = "No hay eventos disponibles" }) => (
    <div className="no-events-message">{message}</div>
);

export default EmptyStateMessage;