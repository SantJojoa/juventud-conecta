// components/shared/LoadingIndicator.jsx
import React from 'react';

const LoadingIndicator = ({ message = "Cargando..." }) => (
    <div className="loading-indicator">{message}</div>
);

export default LoadingIndicator;