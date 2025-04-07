import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-title">Alcaldía de Pasto</h2>
          <div className="footer-info">
            <p><strong>Dirección Principal:</strong></p>
            <p>Sede San Andrés: Carrera 28 # 16 -18</p>
            <p>San Juan de Pasto, Nariño, Colombia</p>
            <p><strong>Horario de atención:</strong></p>
            <p>Lunes a Viernes de 8:00 a.m. a 12:00 m. y 2:00 p.m. a 6:00 p.m.</p>
            <p>NIT: 8912800003 - Código DANE: 52001</p>

            <div className="footer-subsection">
              <p><strong>Nuestras Sedes</strong></p>
              <a href="https://www.pasto.gov.co/index.php/transparencia/localizacion" target="_blank" rel="noopener noreferrer" className="footer-link">Información de sedes</a>
              <p>Última actualización:</p>
              <p>03 de Febrero 2025</p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-subtitle">NUESTROS SÍMBOLOS</h3>
          <ul className="footer-list">
            <li><a href="https://www.pasto.gov.co/index.php/nuestros-simbolos/himno-de-pasto" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Himno de Pasto</a></li>
            <li><a href="https://www.pasto.gov.co/index.php/nuestros-simbolos/bandera-de-pasto" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Bandera de Pasto</a></li>
            <li><a href="https://www.pasto.gov.co/index.php/nuestros-simbolos/escudo-de-pasto" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Escudo de Pasto</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-subtitle">NUESTRA ENTIDAD</h3>
          <ul className="footer-list">
            <li><a href="https://www.pasto.gov.co/index.php/transparencia/mision-vision" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Misión y Visión</a></li>
            <li><a href="https://www.pasto.gov.co/index.php/transparencia/organigrama" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Estructura</a></li>
            <li><a href="https://www.pasto.gov.co/index.php/contenidos/14941-redes-sociales" target="_blank" rel="noopener noreferrer" className="footer-link"><span className="check-icon">✓</span> Redes Sociales</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-subtitle">CONTACTO</h3>
          <ul className="footer-list">
            <li><a href="mailto:contactenos@pasto.gov.co" className="footer-link"><span className="check-icon">✓</span> contactenos@pasto.gov.co</a></li>
            <li><a href="#" className="footer-link"><span className="check-icon">✓</span> Notificaciones Judiciales:</a></li>
            <li><a href="mailto:juridica@pasto.gov.co" className="footer-link"><span className="check-icon">✓</span> juridica@pasto.gov.co</a></li>
            <li><a href="tel:+5760272443" className="footer-link"><span className="check-icon">✓</span> Línea de Servicio a la Ciudadanía : +57 602 7244326</a></li>
            <li><a href="tel:+5760272443" className="footer-link"><span className="check-icon">✓</span> Línea Anticorrupción : +57 602 7244326 ext. 1213</a></li>
            <li><a href="#" className="footer-link"><span className="check-icon">✓</span> Política Derechos de Autor Autorización Uso</a></li>
            <li><a href="#" className="footer-link"><span className="check-icon">✓</span> Sitios Web Aliados</a></li>
            <li><a href="#" className="footer-link"><span className="map-icon">🗺</span> Mapa del Sitio</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-copyright">
        <p>© 2025 Todos los derechos reservados. Administrado por Alcaldía de Pasto.</p>
      </div>
    </footer>
  );
};

export default Footer;