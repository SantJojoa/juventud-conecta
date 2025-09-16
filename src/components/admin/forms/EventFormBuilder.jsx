// src/components/admin/form/EventFormBuilder.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FormService } from '../../../services/formService';
import { AuthService } from '../../../services/authService';
import './EventFormBuilder.css';

const emptyQuestion = { label: '', type: 'text', required: false, options: [] };

const EventFormBuilder = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', isOpen: true, questions: [{ ...emptyQuestion }] });

    useEffect(() => {
        // Opcional: cargar si ya existe
        (async () => {
            try {
                const data = await FormService.getFormByEvent(eventId);
                setForm({
                    title: data.title,
                    description: data.description || '',
                    isOpen: data.isOpen,
                    questions: data.questions?.map(q => ({
                        id: q.id, label: q.label, type: q.type, required: q.required, options: q.options || []
                    })) || [{ ...emptyQuestion }]
                });
            } catch { }
        })();
    }, [eventId]);

    const updateQuestion = (idx, patch) => {
        const next = [...form.questions];
        next[idx] = { ...next[idx], ...patch };
        if (!Array.isArray(next[idx].options)) next[idx].options = [];
        setForm({ ...form, questions: next });
    };

    const addQuestion = () => setForm({ ...form, questions: [...form.questions, { ...emptyQuestion }] });
    const removeQuestion = (idx) => setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });

    const save = async () => {
        try {
            setLoading(true);
            const payload = {
                title: form.title,
                description: form.description,
                isOpen: form.isOpen,
                questions: form.questions.map(q => ({
                    label: q.label,
                    type: q.type,
                    required: !!q.required,
                    options: q.type === 'select' ? { options: q.options.filter(Boolean) } : null
                }))
            };
            await FormService.adminUpsertForm(eventId, payload);
            alert('Formulario guardado');
            navigate(`/events/${eventId}/submissions`);
        } catch (e) {
            alert(e.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-builder-container">
            <h2>Formulario para evento</h2>
            <div className="fb-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="group-label">Título</label>
                    <input className="fb-input" placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="group-label">Descripción</label>
                    <textarea className="fb-textarea" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="switch-row" style={{ gridColumn: '1 / -1' }}>
                    <span className="group-label">Inscripciones abiertas</span>
                    <div className="fb-switch">
                        <label className="fb-toggle-wrapper">
                            <input className="fb-checkbox" id="fb-open" type="checkbox" checked={form.isOpen} onChange={e => setForm({ ...form, isOpen: e.target.checked })} />
                            <span className="fb-toggle" aria-hidden="true"></span>
                        </label>
                    </div>
                </div>

                <h3 style={{ gridColumn: '1 / -1' }}>Preguntas</h3>
                {form.questions.map((q, idx) => (
                    <div key={idx} className="fb-question-card">
                        <div className="form-group">
                            <label className="group-label">Etiqueta</label>
                            <input className="fb-input" placeholder="Etiqueta de la pregunta" value={q.label} onChange={e => updateQuestion(idx, { label: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="group-label">Tipo</label>
                            <select className="fb-select" value={q.type} onChange={e => updateQuestion(idx, { type: e.target.value })}>
                                <option value="text">Texto corto</option>
                                <option value="textarea">Texto largo</option>
                                <option value="number">Número</option>
                                <option value="select">Selección</option>
                                <option value="date">Fecha</option>
                                <option value="email">Email</option>
                                <option value="url">URL</option>
                                <option value="tel">Teléfono</option>
                            </select>
                        </div>
                        <div className="switch-row">
                            <span className="group-label">Requerida</span>
                            <div className="fb-switch">
                                <label className="fb-toggle-wrapper">
                                    <input className="fb-checkbox" id={`fb-required-${idx}`} type="checkbox" checked={q.required} onChange={e => updateQuestion(idx, { required: e.target.checked })} />
                                    <span className="fb-toggle" aria-hidden="true"></span>
                                </label>
                            </div>
                        </div>

                        {q.type === 'select' && (
                            <div className="fb-options" style={{ marginTop: 8 }}>
                                <p>Opciones</p>
                                {(q.options || []).map((opt, j) => (
                                    <input key={j} className="fb-input" placeholder={`Opción ${j + 1}`} value={opt} onChange={e => {
                                        const opts = [...(q.options || [])];
                                        opts[j] = e.target.value;
                                        updateQuestion(idx, { options: opts });
                                    }} />
                                ))}
                                <button type="button" className="fb-btn fb-secondary-outline fb-small" onClick={() => updateQuestion(idx, { options: [...(q.options || []), ''] })}>+ Opción</button>
                            </div>
                        )}

                        <div className="fb-actions">
                            <button type="button" className="fb-btn fb-danger-outline fb-small" onClick={() => removeQuestion(idx)}>Eliminar pregunta</button>
                        </div>
                    </div>
                ))}
                <button type="button" className="fb-btn fb-secondary" style={{ gridColumn: '1 / -1' }} onClick={addQuestion}>+ Añadir pregunta</button>
                <div className="fb-actions">
                    <button className="submit-button" disabled={loading} onClick={save}>{loading ? 'Guardando...' : 'Guardar formulario'}</button>
                    <Link className="fb-btn fb-secondary" to={`/events/${eventId}/submissions`}>Ver inscripciones</Link>
                </div>
            </div>
        </div>
    );
};

export default EventFormBuilder;