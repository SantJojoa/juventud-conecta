import React from 'react';
import './ViewMoreButton.css';

const ViewMoreButton = ({ onClick }) => {
    return (
        <div className="view-more-button-container">
            <button className="view-more-button" onClick={onClick}>
                Ver más eventos
            </button>
        </div>
    );
};

export default ViewMoreButton;