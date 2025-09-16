import { AuthService } from './authService';
const BASE_URL = 'http://localhost:5000/api';

export const FormService = {
    getFormByEvent: async (eventId) => {
        const res = await fetch(`${BASE_URL}/forms/event/${eventId}`);
        if (!res.ok) throw new Error('Error al obtener el formulario');
        return res.json();
    },
    submitForm: async (formId, answers) => {
        const res = await fetch(`${BASE_URL}/forms/${formId}/submit`, {
            method: 'POST',
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify({ answers })
        });
        if (!res.ok) throw new Error('Error al enviar el formulario');
        return res.json();
    },
    adminUpsertForm: async (eventId, payload) => {
        const res = await fetch(`${BASE_URL}/admin/forms/event/${eventId}`, {
            method: 'POST',
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Error al crear o actualizar el formulario');
        return res.json();
    },
    adminToggleOpen: async (formId, isOpen) => {
        const res = await fetch(`${BASE_URL}/admin/forms/${formId}/toggle`, {
            method: 'PATCH',
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify({ isOpen })
        });
        if (!res.ok) throw new Error('Error al cambiar el estado del formulario');
        return res.json();
    },
    adminListSubmissions: async (eventId) => {
        const res = await fetch(`${BASE_URL}/admin/forms/event/${eventId}/submissions`, {
            headers: AuthService.getAuthHeaders()
        });
        if (!res.ok) throw new Error('Error al obtener las respuestas');
        return res.json();
    },
    adminSetSubmissionStatus: async (submissionId, status) => {
        const res = await fetch(`${BASE_URL}/admin/forms/submissions/${submissionId}`, {
            method: 'PATCH',
            headers: AuthService.getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Error al actualizar el estado de la respuesta');
        return res.json();
    }
}