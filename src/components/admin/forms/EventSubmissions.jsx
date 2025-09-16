// src/components/admin/form/EventSubmissions.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormService } from '../../../services/formService';
import './EventSubmissions.css';

const EventSubmissions = () => {
    const { id: eventId } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await FormService.adminListSubmissions(eventId);
            setData(res.submissions || []);
        } catch (e) {
            alert(e.message || 'Error al cargar inscripciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [eventId]);

    const setStatus = async (submissionId, status) => {
        await FormService.adminSetSubmissionStatus(submissionId, status);
        await load();
    };

    if (loading) return <div className="admin-submissions-container">Cargando...</div>;

    return (
        <div className="admin-submissions-container">
            <div className="submissions-header">
                <h1>Inscripciones</h1>
            </div>
            {data.length === 0 ? <p>No hay inscripciones.</p> : (
                <div className="submissions-grid">
                    {data.map(s => (
                        <div key={s.id} className="submission-card">
                            <div className="submission-top">
                                <div className="submission-user">
                                    {s.user?.firstName} {s.user?.lastName} — {s.user?.email}
                                </div>
                                <span className={`status-badge status-${s.status}`}>{s.status}</span>
                            </div>
                            <div className="answers">
                                {s.answers?.map(a => (
                                    <div key={a.id} className="answer-item">
                                        <span className="answer-label">{a.question?.label}:</span>
                                        <span className="answer-value">{a.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="submission-actions">
                                <button className="btn-submission btn-accept" onClick={() => setStatus(s.id, 'accepted')}>Aceptar</button>
                                <button className="btn-submission btn-reject" onClick={() => setStatus(s.id, 'rejected')}>Rechazar</button>
                                <button className="btn-submission btn-pending" onClick={() => setStatus(s.id, 'pending')}>Pendiente</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventSubmissions;