# Juventud Conecta - Event Management System

## Description

This project is a full-stack event management system built with Node.js, Express, and MongoDB for the backend, and a modern JavaScript framework (likely React, Vue, or Angular - specify which one is used) for the frontend. It allows administrators to create, read, update, and delete events.

## Features

*   **CRUD Operations:** Complete CRUD (Create, Read, Update, Delete) operations for events.
*   **Protected Routes:** Backend routes are protected and require admin role verification.
*   **Event Model:** The `Event` model includes the following fields:
    *   `title`: Title of the event.
    *   `imageSrc`: Source URL of the event image.
    *   `description`: Description of the event.
    *   `schedule`: Event schedule details.
    *   `date`: Date of the event.
    *   `location`: Location of the event.
*   **Frontend Integration:** The frontend is fully integrated with the backend API.

## Technologies Used

*   **Backend:**
    *   Node.js
    *   Express
    *   MongoDB
    *   Mongoose (likely, for MongoDB interaction)
    *   JSON Web Tokens (JWT) for authentication
*   **Frontend:**
    *   [Specify the frontend framework used, e.g., React, Vue, Angular]
*   **Other:**
    *   [List any other relevant technologies or libraries]

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd [project directory]
    ```

2.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Configure MongoDB:**

    *   Ensure MongoDB is installed and running.
    *   Update the MongoDB connection string in the `.env` file (create one if it doesn't exist) with your MongoDB credentials.

4.  **Start the backend server:**

    ```bash
    npm start
    ```

5.  **Install frontend dependencies:**

    ```bash
    cd client  # Or the appropriate frontend directory
    npm install  # Or yarn install, depending on the package manager used
    ```

6.  **Start the frontend development server:**

    ```bash
    npm start  ## proyectt
