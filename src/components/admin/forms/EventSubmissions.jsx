// src/components/admin/form/EventSubmissions.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormService } from '../../../services/formService';

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

    if (loading) return <div style={{ margin: '6rem auto', maxWidth: 1000 }}>Cargando...</div>;

    return (
        <div style={{ maxWidth: 1000, margin: '6rem auto', padding: '0 1.5rem' }}>
            <h1>Inscripciones</h1>
            {data.length === 0 ? <p>No hay inscripciones.</p> : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {data.map(s => (
                        <div key={s.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>{s.user?.firstName} {s.user?.lastName}</strong> — {s.user?.email}
                                </div>
                                <div>
                                    <em>Estado:</em> {s.status}
                                </div>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                {s.answers?.map(a => (
                                    <div key={a.id} style={{ marginBottom: 6 }}>
                                        <strong>{a.question?.label}:</strong> {a.value}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button onClick={() => setStatus(s.id, 'accepted')}>Aceptar</button>
                                <button onClick={() => setStatus(s.id, 'rejected')}>Rechazar</button>
                                <button onClick={() => setStatus(s.id, 'pending')}>Pendiente</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventSubmissions;