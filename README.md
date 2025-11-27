# Juventud Conecta

**Juventud Conecta** es una plataforma web diseñada para conectar a los jóvenes con eventos, oportunidades y recursos en su comunidad. Facilita la gestión de eventos, inscripciones y la comunicación entre organizadores y participantes.

## 🚀 Características Principales

-   **Gestión de Eventos:** Creación, edición y eliminación de eventos.
-   **Formularios Dinámicos:** Constructor de formularios personalizados para inscripciones a eventos.
-   **Inscripciones:** Sistema de postulación y gestión de estados (Pendiente, Aceptada, Rechazada).
-   **Notificaciones:** Alertas en tiempo real sobre el estado de las postulaciones.
-   **Chatbot:** Asistente virtual para resolver dudas frecuentes.
-   **Autenticación:** Sistema seguro de registro e inicio de sesión.

## 🛠️ Tecnologías Utilizadas

### Frontend
-   **React:** Biblioteca principal para la interfaz de usuario.
-   **Vite:** Empaquetador y servidor de desarrollo rápido.
-   **React Router:** Manejo de rutas y navegación.
-   **Material UI / CSS:** Estilizado de componentes.

### Backend
-   **Node.js & Express:** Servidor y API RESTful.
-   **PostgreSQL:** Base de datos relacional.
-   **Sequelize:** ORM para interactuar con la base de datos.
-   **JWT:** Autenticación basada en tokens.

## ⚙️ Configuración del Proyecto

### Prerrequisitos
-   Node.js (v18 o superior)
-   PostgreSQL
-   pnpm (recomendado) o npm

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/juventud-conecta.git
    cd juventud-conecta
    ```

2.  **Instalar dependencias del Frontend:**
    ```bash
    pnpm install
    ```

3.  **Instalar dependencias del Backend:**
    ```bash
    cd server
    pnpm install
    ```

### Variables de Entorno

Crea un archivo `.env` en la carpeta `server` con la siguiente configuración:

```env
PORT=5000
DB_NAME=nombre_base_datos
DB_USER=usuario_db
DB_PASSWORD=contraseña_db
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt
```

### Ejecución

1.  **Iniciar el Backend:**
    ```bash
    cd server
    npm run dev
    ```

2.  **Iniciar el Frontend:**
    ```bash
    # En una nueva terminal, en la raíz del proyecto
    npm run dev
    ```

## 💡 Tips para Desarrolladores

-   **Estructura de Carpetas:**
    -   `src/components`: Componentes de React reutilizables.
    -   `src/services`: Lógica de comunicación con la API.
    -   `server/config/models`: Modelos de Sequelize.
    -   `server/config/controllers`: Lógica de negocio de los endpoints.

-   **Base de Datos:**
    -   Asegúrate de que PostgreSQL esté corriendo antes de iniciar el servidor.
    -   Sequelize sincronizará automáticamente los modelos al iniciar (`sequelize.sync({ alter: true })`).

-   **Formularios:**
    -   El constructor de formularios permite crear preguntas de tipo texto, selección, fecha, etc. Las respuestas se guardan en `EventFormAnswers`.

-   **Contribución:**
    -   Sigue las convenciones de código existentes.
    -   Crea una rama para cada nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).

---
Desarrollado con ❤️ por el equipo de Juventud Conecta.
