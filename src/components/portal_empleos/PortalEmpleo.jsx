import React, { useState } from 'react';
import './PortalEmpleo.css';

const items = [
    'Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5',
    'Opción 6', 'Opción 7', 'Opción 8', 'Opción 9', 'Opción 10'
];

const PortalEmpleo = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="portal-empleo">
            <div className="grid">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid-item"
                        onClick={() => openModal(item)}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedItem}</h3>
                        <p>Contenido relacionado a {selectedItem}</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortalEmpleo;
