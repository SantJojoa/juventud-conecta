// PortalEmpleo.jsx
import React, { useState } from 'react';
import './PortalEmpleo.css';

const items = [
    {
        id: 1,
        image: 'https://guiasyscoutsdechile.org/wp-content/uploads/2020/09/bannerparticipacion.jpg',
        title: 'Participación Juvenil',
        description: 'Fortalecer espacios de participación.',
        subContent: 'Para que los jóvenes influyan en las decisiones públicas y Apoyen la conformación y funcionamiento de organizaciones juveniles.'
    },
    {
        id: 2,
        image: 'https://png.pngtree.com/background/20210715/original/pngtree-education-dark-green-background-simple-style-poster-banner-picture-image_1301825.jpg',
        title: 'Educación y Formación',
        description: 'Implementar programas de capacitación técnica y profesional.',
        subContent: 'Se hace con el fin de mejorar la empleabilidad; facilitando el acceso a educación superior con becas y apoyos económicos.'
    },
    {
        id: 3,
        image: 'https://www.ibero.edu.co/sites/default/files/styles/contenido_dinamico_1920_530/public/2025-03/banner-administracion-de-empresas-en-el-emprendimiento.jpg.webp?itok=h3rnPjD6',
        title: 'Empleo y Emprendimiento Juvenil',
        description: 'Crear estrategias de vinculación laboral para jóvenes.',
        subContent: 'Fomentar el emprendimiento con asesoría y financiamiento.'
    },
    {
        id: 4,
        image: 'https://espanol.kaiserpermanente.org/content/dam/kporg/final/images/people/lifestyle/two/young-man-and-woman-jog-by-beach.png',
        title: 'Salud y Bienestar Juvenil',
        description: 'Promover la salud mental y prevención del consumo de sustancias psicoactivas.',
        subContent: 'Ampliar el acceso a servicios psicologicos, de salud sexual y reproductiva.'
    },
    {
        id: 5,
        image: 'https://vicecultura.unicauca.edu.co/viceculturav2/sites/default/files/slider1_0.png',
        title: 'Cultura y Recreación',
        description: 'Impulsar espacios culturales y artísticos.',
        subContent: 'Dando espacios para la expresión juvenil con eventos deportivos y recreativos para mejorar la calidad de vida.'
    },
    {
        id: 6,
        image: 'https://postgrados.derecho.uchile.cl/wp-content/uploads/2020/11/01-diploma-genero-y-derechoshumanos.jpg',
        title: 'Derechos Humanos y Equidad de Género',
        description: 'Garantizar la protección de los derechos.',
        subContent: 'Impulsar programas de equidad de género y prevención de violencias, asi como capacitaciones en leyes y derechos humanos.'
    },
    {
        id: 7,
        image: 'https://thumbs.dreamstime.com/b/fondo-de-banners-tecnolog%C3%ADa-c%C3%B3digos-datos-inform%C3%A1ticos-innovaci%C3%B3n-%C3%B3rbitas-digitales-red-mundial-comunicaci%C3%B3n-tecnol%C3%B3gica-193837666.jpg',
        title: 'Innovación y Tecnología',
        description: 'Desarrollar proyectos de formación tecnologíca.',
        subContent: 'Brindar acceso a herramientas digitales y conectividad en zonas rurales para el realce de la competitividad TIC.'
    },
    {
        id: 8,
        image: 'https://www.elandcables.com/media/iu3jikc4/v638169987797000001/protecting-the-environment-banner.jpg',
        title: 'Medio Ambiente y Sostenibilidad',
        description: 'Fomentar la educación ambiental y el liderazgo.',
        subContent: 'iniciativas ecológicas con programas de reciclaje y conservación de la biodiversidad.'
    },
    {
        id: 9,
        image: 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/assets/2018/11/20-11-18_WB_Brazil-crop.jpg/image1440x560cropped.jpg',
        title: 'Juventud Rural',
        description: 'Políticas que respondan a las necesidades de los jóvenes en zonas rurales.',
        subContent: 'Mejorar el acceso a educación, empleo y salud en áreas apartadas del departamento.'
    },
    {
        id: 10,
        image: 'https://et12.edu.ar/imgs/Banner%20Convivencia.png',
        title: 'Seguridad y Convivencia Juvenil',
        description: 'Prevencion de la violencia.',
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

    return (
        <div className="portal-empleo">
            <div className="grid">
                {items.map(item => (
                    <div key={item.id} className="grid-item" onClick={() => handleItemClick(item)}>
                        <img src={item.image} alt={item.title} className="item-image" />
                        <h4>{item.title}</h4>
                        <p className="item-description">{item.description}</p>
                    </div>
                ))}
            </div>

            {activeItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={activeItem.image} alt={activeItem.title} className="modal-image" />
                        <div className="modal-content">
                            <h3>{activeItem.title}</h3>
                            <p>{activeItem.subContent}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortalEmpleo;
