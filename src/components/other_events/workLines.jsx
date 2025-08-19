// PortalEmpleo.jsx
import React, { useState, useEffect } from 'react';
import './workLines.css';



const items = [
    {
        id: 1,
        image: 'https://www.pasto.gov.co/images/2023/mar/primera_sesion_mesa_de_participacion_de_ninos_ninas_y_adolescentes.jpg',
        title: '1. Participación Juvenil',
        description: 'Fortalecer espacios de participación.',
        subContent: 'Para que los jóvenes influyan en las decisiones públicas y Apoyen la conformación y funcionamiento de organizaciones juveniles.'
    },
    {
        id: 2,
        image: 'https://www.pasto.gov.co/images/2025/feb/imagen_educaion3.jpg',
        title: '2. Educación y Formación',
        description: 'Implementar programas de capacitación técnica y profesional.',
        subContent: 'Se hace con el fin de mejorar la empleabilidad; facilitando el acceso a educación superior con becas y apoyos económicos.'
    },
    {
        id: 3,
        image: 'https://www.ibero.edu.co/sites/default/files/styles/contenido_dinamico_1920_530/public/2025-03/banner-administracion-de-empresas-en-el-emprendimiento.jpg.webp?itok=h3rnPjD6',
        title: '3. Empleo y Emprendimiento Juvenil',
        description: 'Crear estrategias de vinculación laboral para jóvenes.',
        subContent: 'Fomentar el emprendimiento con asesoría y financiamiento.'
    },
    {
        id: 4,
        image: 'https://www.avantserveis.com/wp-content/uploads/2019/07/IMAGE_1206100_Calisthenics-3-600x395.jpg',
        title: '4. Salud y Bienestar Juvenil',
        description: 'Promover la salud mental y prevención del consumo de sustancias psicoactivas.',
        subContent: 'Ampliar el acceso a servicios psicológicos, de salud sexual y reproductiva.'
    },
    {
        id: 5,
        image: 'https://i.ytimg.com/vi/1oy9Av50wuI/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGcgZyhnMA8=&rs=AOn4CLD6mjCpBIsL5aGS4g03Tv3JJJTxEQ',
        title: '5. Cultura y Recreación',
        description: 'Impulsar espacios culturales y artísticos.',
        subContent: 'Dando espacios para la expresión juvenil con eventos deportivos y recreativos para mejorar la calidad de vida.'
    },
    {
        id: 6,
        image: 'https://postgrados.derecho.uchile.cl/wp-content/uploads/2020/11/01-diploma-genero-y-derechoshumanos.jpg',
        title: '6. Derechos Humanos y Equidad de Género',
        description: 'Garantizar la protección de los derechos.',
        subContent: 'Impulsar programas de equidad de género y prevención de violencias, asi como capacitaciones en leyes y derechos humanos.'
    },
    {
        id: 7,
        image: 'https://www.elcalbucano.cl/wp-content/uploads/2025/07/pexels-ivan-samkov-5428648-scaled.jpg',
        title: '7. Innovación y Tecnología',
        description: 'Desarrollar proyectos de formación tecnológica.',
        subContent: 'Brindar acceso a herramientas digitales y conectividad en zonas rurales para el realce de la competitividad TIC.'
    },
    {
        id: 8,
        image: 'https://www.pasto.gov.co/images/2021/jun/practicas_ambientales.jpg',
        title: '8. Medio Ambiente y Sostenibilidad',
        description: 'Fomentar la educación ambiental y el liderazgo.',
        subContent: 'iniciativas ecológicas con programas de reciclaje y conservación de la biodiversidad.'
    },
    {
        id: 9,
        image: 'https://narinonoticias.com/wp-content/uploads/2023/12/Aguapamba.jpg',
        title: '9. Juventud Rural',
        description: 'Políticas que respondan a las necesidades de los jóvenes en zonas rurales.',
        subContent: 'Mejorar el acceso a educación, empleo y salud en áreas apartadas del departamento.'
    },
    {
        id: 10,
        image: 'https://www.ansv.gov.co/sites/default/files/2024/Comunicados/Comunicado054_Img1.png',
        title: '10. Seguridad y Convivencia Juvenil',
        description: 'Prevención de la violencia.',
        subContent: 'Desarrollar estrategias de seguridad enfocadas en la juventud para un entorno familiar y social de calidad.'
    }
];

const PortalEmpleo = () => {
    const [activeItem, setActiveItem] = useState(null);

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const closeModal = () => {
        setActiveItem(null);
    };


    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [])
    return (
        <div className="portal-empleo">
            <div className="text-container">
                <h2>¡Nuestras 10 Lineas de trabajo!</h2>
                <p>"Pasto, territorio de oportunidades para la población joven"</p>
            </div>
            <div className="grid">
                {items.map(item => (
                    <div key={item.id} className="grid-item" onClick={() => handleItemClick(item)}>
                        <div className="image-wrapper">
                            <img src={item.image} alt={item.title} className="item-image" />
                        </div>
                        <h4>{item.title}</h4>
                        <p className="item-description">{item.description}</p>
                    </div>
                ))}
            </div>
            {activeItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button" onClick={closeModal}>
                            X
                        </button>
                        <div className="modal-body">
                            <img
                                src={activeItem.image}
                                alt={activeItem.title}
                                className="modal-image"
                            />
                            <div className="modal-text">
                                <h3>{activeItem.title}</h3>
                                <hr />
                                <p>{activeItem.subContent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PortalEmpleo;
